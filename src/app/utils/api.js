// utils/api.js

import axios from "axios";
import { API_BASE_URL, BEARER_TOKEN } from "../../config";

export const makeAuthenticatedRequest = async (
  method,
  endpoint,
  data = null
) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    // Handle error
    console.error("API request error:", error);
    throw error;
  }
};
