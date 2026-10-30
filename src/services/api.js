import axios from "axios";

/**
 * Sends business evaluation data to /api/predict.
 * @param {Object} formData
 * @returns {Promise<Object>}
 */
export const predictCreditScore = async (formData) => {
  const response = await axios.post("/api/predict", {
    data: formData,
  });
  return response.data;
};

/**
 * Checks backend health at /api/health.
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  const response = await axios.get("/api/health");
  return response.data;
};

export default {
  predictCreditScore,
  checkHealth,
};
