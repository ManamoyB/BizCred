from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import lightgbm as lgb

# Load trained model and encoders
lgb_model = joblib.load("lgbm_cibil_model.pkl")
label_encoders = joblib.load("label_encoders_lgbm.pkl")

# Define feature names
features = [
    "Business Type", "Years of Operation", "Partnership Type", "Applicant Age", "Associates CIBIL Score",
    "Licensing Verified", "Quality Control Verified", "PAN Registered", "TAN Registered", "GST Registered",
    "Excise Registered", "GST Filing Status", "Tax Return Filed", "Geography", "Purpose of Loan", "Market Forecast",
    "Market Stability Years", "USP Strength", "Social Media Followers", "Social Media Engagement",
    "Online Review Rating", "Annual Revenue (in Lakh)", "Annual Fixed Expenses (in Lakh)",
    "Annual Variable Expenses (in Lakh)", "Supplier Payments (in Lakh)", "Loan Defaults",
    "Credit Utilization Ratio", "Digital Invoice Usage", "Bank Transactions (per year)", "Collateral Strength"
]

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (change to specific frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define input schema
class CibilInput(BaseModel):
    data: dict

# API endpoint
@app.post("/predict")
def predict_cibil_score(input_data: CibilInput):
    user_input = input_data.data

    # Convert categorical values using label encoders
    for feature in features:
        if feature in label_encoders and feature in user_input:
            user_input[feature] = label_encoders[feature].transform([user_input[feature]])[0]

    # Convert to DataFrame
    user_df = pd.DataFrame([user_input])

    # Predict CIBIL Score
    predicted_cibil_score = lgb_model.predict(user_df)[0]

    return {"predicted_cibil_score": round(predicted_cibil_score, 2)}
