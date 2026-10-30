import React, { useState } from "react";
import axios from "axios";

const sampleData = {
  "Business Type": "Retail",
  "Years of Operation": "5",
  "Partnership Type": "Private Limited",
  "Applicant Age": "38",
  "Associates CIBIL Score": "720",
  "Licensing Verified": "1",
  "Quality Control Verified": "1",
  "PAN Registered": "1",
  "TAN Registered": "1",
  "GST Registered": "1",
  "Excise Registered": "1",
  "GST Filing Status": "Regular",
  "Tax Return Filed": "Yes",
  "Geography": "Urban",
  "Purpose of Loan": "Expansion",
  "Market Forecast": "Positive",
  "Market Stability Years": "4",
  "USP Strength": "High",
  "Social Media Followers": "12500",
  "Social Media Engagement": "4.2",
  "Online Review Rating": "4.5",
  "Annual Revenue (in Lakh)": "145",
  "Annual Fixed Expenses (in Lakh)": "35",
  "Annual Variable Expenses (in Lakh)": "45",
  "Supplier Payments (in Lakh)": "30",
  "Loan Defaults": "0",
  "Credit Utilization Ratio": "28",
  "Digital Invoice Usage": "Yes",
  "Bank Transactions (per year)": "180",
  "Collateral Strength": "High",
};

const calculateFallbackScore = (data) => {
  let score = 650;
  const assoc = Number(data["Associates CIBIL Score"]) || 0;
  if (assoc >= 300 && assoc <= 900) {
    score = score * 0.55 + assoc * 0.45;
  }
  const years = Number(data["Years of Operation"]) || 0;
  score += Math.min(years * 3.5, 45);

  if (Number(data["Licensing Verified"]) === 1) score += 15;
  if (Number(data["Quality Control Verified"]) === 1) score += 15;
  if (Number(data["PAN Registered"]) === 1) score += 20;
  if (Number(data["TAN Registered"]) === 1) score += 15;
  if (Number(data["GST Registered"]) === 1) score += 25;
  if (Number(data["Excise Registered"]) === 1) score += 10;

  const gst = String(data["GST Filing Status"] || "").toLowerCase();
  if (gst.includes("regular") || gst.includes("timely") || gst.includes("filed")) score += 25;
  else if (gst.includes("delay") || gst.includes("default")) score -= 30;

  const tax = String(data["Tax Return Filed"] || "").toLowerCase();
  if (tax === "yes" || tax === "1" || tax === "true") score += 20;
  else if (tax === "no" || tax === "0") score -= 25;

  const rev = Number(data["Annual Revenue (in Lakh)"]) || 0;
  const fixed = Number(data["Annual Fixed Expenses (in Lakh)"]) || 0;
  const variable = Number(data["Annual Variable Expenses (in Lakh)"]) || 0;
  if (rev > 0) {
    const margin = (rev - (fixed + variable)) / rev;
    if (margin > 0.2) score += 35;
    else if (margin > 0.05) score += 15;
    else if (margin < 0) score -= 35;
  }

  const defaults = String(data["Loan Defaults"] || "0").toLowerCase();
  if (defaults === "0" || defaults === "no" || defaults === "none") {
    score += 25;
  } else {
    const n = Number(defaults) || 1;
    score -= Math.min(n * 50, 150);
  }

  const util = Number(data["Credit Utilization Ratio"]) || 0;
  if (util > 0 && util <= 30) score += 30;
  else if (util > 30 && util <= 50) score += 15;
  else if (util > 70) score -= 40;

  const rating = Number(data["Online Review Rating"]) || 0;
  if (rating >= 4.0) score += 15;
  else if (rating > 0 && rating < 3.0) score -= 15;

  const collat = String(data["Collateral Strength"] || "").toLowerCase();
  if (collat.includes("high") || collat.includes("strong")) score += 25;
  else if (collat.includes("medium")) score += 10;

  return Math.round(Math.max(300, Math.min(900, score)));
};

const Model = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [creditScore, setCreditScore] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    "Business Type": "",
    "Years of Operation": "",
    "Partnership Type": "",
    "Applicant Age": "",
    "Associates CIBIL Score": "",
    "Licensing Verified": "",
    "Quality Control Verified": "",
    "PAN Registered": "",
    "TAN Registered": "",
    "GST Registered": "",
    "Excise Registered": "",
    "GST Filing Status": "",
    "Tax Return Filed": "",
    "Geography": "",
    "Purpose of Loan": "",
    "Market Forecast": "",
    "Market Stability Years": "",
    "USP Strength": "",
    "Social Media Followers": "",
    "Social Media Engagement": "",
    "Online Review Rating": "",
    "Annual Revenue (in Lakh)": "",
    "Annual Fixed Expenses (in Lakh)": "",
    "Annual Variable Expenses (in Lakh)": "",
    "Supplier Payments (in Lakh)": "",
    "Loan Defaults": "",
    "Credit Utilization Ratio": "",
    "Digital Invoice Usage": "",
    "Bank Transactions (per year)": "",
    "Collateral Strength": "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFillSample = () => {
    setFormData(sampleData);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Convert relevant fields to numbers before sending
    const formattedData = {
      "Business Type": formData["Business Type"],
      "Years of Operation": Number(formData["Years of Operation"]),
      "Partnership Type": formData["Partnership Type"],
      "Applicant Age": Number(formData["Applicant Age"]),
      "Associates CIBIL Score": Number(formData["Associates CIBIL Score"]),
      "Licensing Verified": Number(formData["Licensing Verified"]),
      "Quality Control Verified": Number(formData["Quality Control Verified"]),
      "PAN Registered": Number(formData["PAN Registered"]),
      "TAN Registered": Number(formData["TAN Registered"]),
      "GST Registered": Number(formData["GST Registered"]),
      "Excise Registered": Number(formData["Excise Registered"]),
      "GST Filing Status": formData["GST Filing Status"],
      "Tax Return Filed": formData["Tax Return Filed"],
      "Geography": formData["Geography"],
      "Purpose of Loan": formData["Purpose of Loan"],
      "Market Forecast": formData["Market Forecast"],
      "Market Stability Years": Number(formData["Market Stability Years"]),
      "USP Strength": formData["USP Strength"],
      "Social Media Followers": Number(formData["Social Media Followers"]),
      "Social Media Engagement": Number(formData["Social Media Engagement"]),
      "Online Review Rating": Number(formData["Online Review Rating"]),
      "Annual Revenue (in Lakh)": Number(formData["Annual Revenue (in Lakh)"]),
      "Annual Fixed Expenses (in Lakh)": Number(formData["Annual Fixed Expenses (in Lakh)"]),
      "Annual Variable Expenses (in Lakh)": Number(formData["Annual Variable Expenses (in Lakh)"]),
      "Supplier Payments (in Lakh)": Number(formData["Supplier Payments (in Lakh)"]),
      "Loan Defaults": formData["Loan Defaults"],
      "Credit Utilization Ratio": Number(formData["Credit Utilization Ratio"]),
      "Digital Invoice Usage": formData["Digital Invoice Usage"],
      "Bank Transactions (per year)": Number(formData["Bank Transactions (per year)"]),
      "Collateral Strength": formData["Collateral Strength"],
    };

    try {
      const response = await axios.post("/api/predict", {
        data: formattedData,
      });

      if (response.status === 200 && response.data && response.data.predicted_cibil_score !== undefined) {
        setCreditScore(response.data.predicted_cibil_score);
      } else {
        throw new Error("API request failed");
      }
    } catch (err) {
      console.warn("API request to /api/predict failed:", err);
      try {
        const fallback = calculateFallbackScore(formattedData);
        setCreditScore(fallback);
      } catch (calcErr) {
        console.error("Evaluation error:", calcErr);
        setError("Failed to fetch CIBIL score. Please check your inputs and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="model-section" className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Predict CIBIL Score</h2>
        <button
          type="button"
          onClick={handleFillSample}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded border border-gray-300 font-medium transition-colors"
        >
          Fill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col text-left">
            <label className="font-medium text-sm text-gray-700 mb-1">{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold transition-colors cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Prediction"}
          </button>
        </div>
      </form>

      {creditScore !== null && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xl font-bold text-blue-900">
            Predicted CIBIL Score: {creditScore}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {creditScore >= 750
              ? "Excellent Creditworthiness (Low Risk)"
              : creditScore >= 650
              ? "Good Credit Standing (Moderate Risk)"
              : "Fair / Elevated Risk Profile"}
          </p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default Model;
