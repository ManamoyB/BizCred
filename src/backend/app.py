from flask import Flask, request, jsonify
import pandas as pd
import joblib
import lightgbm as lgb

# Initialize Flask app
app = Flask(__name__)

# Load the trained model and label encoders
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

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Prepare input data for prediction
        user_input = {}
        for feature in features:
            value = data.get(feature, "")

            # Convert boolean-like values to integer (1 for Yes/True, 0 for No/False)
            if isinstance(value, str):
                if value.lower() in ["true", "yes"]:
                    value = 1
                elif value.lower() in ["false", "no"]:
                    value = 0
                # Encode categorical variables
                elif feature in label_encoders.keys():
                    value = label_encoders[feature].transform([value])[0]
                else:
                    try:
                        value = float(value)  # Convert numeric values
                    except ValueError:
                        pass  # Keep as string for label encoding

            user_input[feature] = value

        # Convert user input into a DataFrame for prediction
        user_df = pd.DataFrame([user_input])

        # Predict CIBIL Score
        predicted_cibil_score = lgb_model.predict(user_df)[0]

        # Return the predicted score as JSON
        return jsonify({
            "predicted_cibil_score": predicted_cibil_score,
            "predicted_cibil_score_formatted": f"{predicted_cibil_score:.2f}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)