require("dotenv").config();
export const API_BASE_URL = "https://api.tofuhq.com/api/";
export const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN || "";
