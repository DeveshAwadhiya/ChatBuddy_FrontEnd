// src/lib/axios.js
import axios from "axios";

console.log("Axios baseURL:", baseURL);
const baseURL = import.meta.env.VITE_BACKEND_URL || "https://chatbuddy-uy11.onrender.com/apii";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
