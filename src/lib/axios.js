const baseURL = import.meta.env.VITE_BACKEND_URL;

if (!baseURL) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
