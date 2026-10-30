import json
import math
import os
from typing import Any, Dict
from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application
app = FastAPI(title="BizCred API", description="AI-powered Business Credit Intelligence API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load compact model files using os.path.dirname(__file__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "lgbm_model_trees.json")
ENCODERS_PATH = os.path.join(BASE_DIR, "label_encoder_classes.json")

model_trees = None
label_encoders = None

try:
    with open(MODEL_PATH, "r", encoding="utf-8") as model_file:
        model_data = json.load(model_file)
    if model_data.get("objective") != "regression":
        raise ValueError("The compact predictor only supports regression models.")
    model_trees = model_data["trees"]

    with open(ENCODERS_PATH, "r", encoding="utf-8") as encoders_file:
        encoder_classes = json.load(encoders_file)
    label_encoders = {
        feature: {value: index for index, value in enumerate(classes)}
        for feature, classes in encoder_classes.items()
    }
    if not model_trees:
        raise ValueError("The compact model contains no trees.")
    print("Successfully loaded compact LightGBM model data and encoders.")
except Exception as error:
    print(f"Warning: Could not load trained ML model data ({error}). Using algorithmic fallback.")

# 30 Feature Names
FEATURES = [
    "Business Type", "Years of Operation", "Partnership Type", "Applicant Age", "Associates CIBIL Score",
    "Licensing Verified", "Quality Control Verified", "PAN Registered", "TAN Registered", "GST Registered",
    "Excise Registered", "GST Filing Status", "Tax Return Filed", "Geography", "Purpose of Loan", "Market Forecast",
    "Market Stability Years", "USP Strength", "Social Media Followers", "Social Media Engagement",
    "Online Review Rating", "Annual Revenue (in Lakh)", "Annual Fixed Expenses (in Lakh)",
    "Annual Variable Expenses (in Lakh)", "Supplier Payments (in Lakh)", "Loan Defaults",
    "Credit Utilization Ratio", "Digital Invoice Usage", "Bank Transactions (per year)", "Collateral Strength"
]

def compute_fallback_credit_score(user_data: Dict[str, Any]) -> float:
    """Calculates realistic CIBIL credit score (300-900) based on credit evaluation factors."""
    score = 650.0

    # Associates CIBIL Score
    try:
        assoc = float(user_data.get("Associates CIBIL Score", 0))
        if 300 <= assoc <= 900:
            score = score * 0.55 + assoc * 0.45
    except (ValueError, TypeError):
        pass

    # Years of Operation
    try:
        years = float(user_data.get("Years of Operation", 0))
        score += min(years * 3.5, 45.0)
    except (ValueError, TypeError):
        pass

    # Compliance verification checks
    compliance_fields = [
        ("Licensing Verified", 15),
        ("Quality Control Verified", 15),
        ("PAN Registered", 20),
        ("TAN Registered", 15),
        ("GST Registered", 25),
        ("Excise Registered", 10),
    ]
    for field, pts in compliance_fields:
        val = str(user_data.get(field, "")).strip().lower()
        if val in ["1", "true", "yes"]:
            score += pts
        elif field in ["PAN Registered", "GST Registered"] and val in ["0", "false", "no"]:
            score -= 25

    # GST Filing Status
    gst_status = str(user_data.get("GST Filing Status", "")).strip().lower()
    if any(k in gst_status for k in ["regular", "timely", "filed", "on time", "good"]):
        score += 25
    elif any(k in gst_status for k in ["delayed", "late", "default", "irregular"]):
        score -= 30

    # Tax Return Filed
    tax_filed = str(user_data.get("Tax Return Filed", "")).strip().lower()
    if tax_filed in ["1", "true", "yes"]:
        score += 20
    elif tax_filed in ["0", "false", "no"]:
        score -= 25

    # Financial margin
    try:
        rev = float(user_data.get("Annual Revenue (in Lakh)", 0))
        fixed_exp = float(user_data.get("Annual Fixed Expenses (in Lakh)", 0))
        var_exp = float(user_data.get("Annual Variable Expenses (in Lakh)", 0))
        if rev > 0:
            margin = (rev - (fixed_exp + var_exp)) / rev
            if margin > 0.2:
                score += 35
            elif margin > 0.05:
                score += 15
            elif margin < 0:
                score -= 35
    except (ValueError, TypeError):
        pass

    # Loan Defaults
    defaults = str(user_data.get("Loan Defaults", "0")).strip().lower()
    if defaults in ["0", "no", "none"]:
        score += 25
    else:
        try:
            num = float(defaults)
            score -= min(num * 50.0, 150.0)
        except (ValueError, TypeError):
            score -= 50.0

    # Credit Utilization Ratio
    try:
        util = float(user_data.get("Credit Utilization Ratio", 0))
        if 0 < util <= 30:
            score += 30
        elif 30 < util <= 50:
            score += 15
        elif util > 70:
            score -= 40
    except (ValueError, TypeError):
        pass

    # Online Review Rating
    try:
        rating = float(user_data.get("Online Review Rating", 0))
        if rating >= 4.0:
            score += 15
        elif 0 < rating < 3.0:
            score -= 15
    except (ValueError, TypeError):
        pass

    # Collateral Strength
    collat = str(user_data.get("Collateral Strength", "")).strip().lower()
    if "high" in collat or "strong" in collat:
        score += 25
    elif "medium" in collat or "moderate" in collat:
        score += 10

    # Clamp between 300 and 900
    score = max(300.0, min(900.0, score))
    return round(score, 2)


def predict_tree(tree: list, feature_values: list[float]) -> float:
    while len(tree) > 1:
        feature_index, threshold, default_left, left_child, right_child = tree
        value = feature_values[feature_index]
        if math.isnan(value):
            tree = left_child if default_left else right_child
        else:
            tree = left_child if value <= threshold else right_child
    return tree[0]


def run_prediction(user_input: Dict[str, Any]) -> float:
    """Preprocesses input and executes model inference or fallback."""
    if "data" in user_input and isinstance(user_input["data"], dict):
        user_input = user_input["data"]

    if model_trees is not None and label_encoders is not None:
        try:
            feature_values = []
            for feature in FEATURES:
                value = user_input.get(feature, "")
                if isinstance(value, str):
                    if value.lower() in ["true", "yes"]:
                        value = 1
                    elif value.lower() in ["false", "no"]:
                        value = 0
                    elif feature in label_encoders:
                        value = label_encoders[feature].get(value, 0)
                    else:
                        value = float(value)
                elif value is None:
                    value = float("nan")
                else:
                    value = float(value)
                feature_values.append(value)

            predicted = sum(predict_tree(tree, feature_values) for tree in model_trees)
            return round(max(300.0, min(900.0, predicted)), 2)
        except Exception as error:
            print(f"ML inference error: {error}. Falling back to rule-based prediction.")

    return compute_fallback_credit_score(user_input)


# APIRouter with /api prefix
api_router = APIRouter(prefix="/api")

@api_router.get("/health")
def health_check():
    return {"status": "ok"}

@api_router.post("/predict")
async def predict_api(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    predicted_score = run_prediction(body)
    return {
        "predicted_cibil_score": predicted_score,
        "predicted_cibil_score_formatted": f"{predicted_score:.2f}",
        "status": "success"
    }

# Include the router
app.include_router(api_router)

# Also expose without prefix so both /predict and /api/predict work seamlessly
@app.get("/health")
def health_check_root():
    return {"status": "ok"}

@app.post("/predict")
async def predict_root(request: Request):
    return await predict_api(request)
