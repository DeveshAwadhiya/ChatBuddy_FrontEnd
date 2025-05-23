import axios from 'axios';


const baseURL = "https://chatbuddy-uy11.onrender.com/api"

if (!baseURL) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
