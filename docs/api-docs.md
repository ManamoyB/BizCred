# API Documentation

## Prediction Endpoint
POST /predict

### Request Payload
Business intelligence attributes including:
- business profile
- compliance data
- financial metrics
- credit behavior indicators
- digital trust metrics

### Response
Returns predicted business credit score.

Example:
{
  "predicted_cibil_score": 742
}
