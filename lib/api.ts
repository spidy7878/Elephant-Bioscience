import axios from "axios";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://appetizing-cabbage-e4ead111c1.strapiapp.com").replace(/\/$/, "");


export const api = axios.create({
  baseURL: API_URL,
});
