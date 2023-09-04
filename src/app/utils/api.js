import axios from "axios";
import { API_BASE_URL, BEARER_TOKEN } from "../../config";

export const patchContent = async (data) => {
  try {
    const response = await makeAuthenticatedRequest(
      "PATCH",
      "content/1521",
      data
    );
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export const postResults = async (data) => {
  try {
    const response = await makeAuthenticatedRequest(
      "POST",
      "content/1521/gen/",
      data
    );

    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

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
    console.error("API request error:", error);
    throw error;
  }
};
