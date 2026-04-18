import axios from "axios";

// Dev: use relative /api so Vite proxies to the backend (see vite.config.js). Prod / preview: set VITE_API_URL or default to localhost.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // optional: localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default api;
