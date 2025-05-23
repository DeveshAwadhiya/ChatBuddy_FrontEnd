// src/lib/axios.js
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "https://chatbuddy-uy11.onrender.com/apii";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
