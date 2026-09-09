import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extract a human-readable error message from an Axios error.
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const summaryApi = {
  create: (url) => api.post("/summaries", { url }),
  list: () => api.get("/summaries"),
  remove: (id) => api.delete(`/summaries/${id}`),
};

export default api;
