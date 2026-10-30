import os
from typing import Any, Dict
from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

# Load model files using os.path.dirname(__file__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "lgbm_cibil_model.pkl")
ENCODERS_PATH = os.path.join(BASE_DIR, "label_encoders_lgbm.pkl")

lgb_model = None
label_encoders = None

try:
    import joblib
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH):
        lgb_model = joblib.load(MODEL_PATH)
        label_encoders = joblib.load(ENCODERS_PATH)
        print("Successfully loaded LightGBM model and encoders.")
    else:
        print(f"Model files not found in {BASE_DIR}")
except Exception as e:
    print(f"Warning: Could not load trained ML models ({e}). Using algorithmic fallback.")

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


def run_prediction(user_input: Dict[str, Any]) -> float:
    """Preprocesses input and executes model inference or fallback."""
    # Check if input is nested under 'data'
    if "data" in user_input and isinstance(user_input["data"], dict):
        user_input = user_input["data"]

    # If ML model is loaded and pandas is available
    if lgb_model is not None and label_encoders is not None:
        try:
            import pandas as pd
            processed_input = {}
            for feature in FEATURES:
                val = user_input.get(feature, "")
                if isinstance(val, str):
                    if val.lower() in ["true", "yes"]:
                        val = 1
                    elif val.lower() in ["false", "no"]:
                        val = 0
                    elif feature in label_encoders:
                        try:
                            val = label_encoders[feature].transform([val])[0]
                        except Exception:
                            # Use first known class index or 0 if unseen category
                            val = 0
                    else:
                        try:
                            val = float(val)
                        except ValueError:
                            pass
                processed_input[feature] = val

            df = pd.DataFrame([processed_input])
            predicted = float(lgb_model.predict(df)[0])
            # Ensure within 300-900 bounds
            return round(max(300.0, min(900.0, predicted)), 2)
        except Exception as err:
            print(f"ML inference error: {err}. Falling back to rule-based prediction.")

    # Algorithmic fallback
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
