import axios from "axios";

// Single Axios instance for every backend call. This replaces the old
// Firebase SDK (`config/firebase.js`) as the one way the frontend talks to
// the server — no other file should construct its own HTTP client.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the access token (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try exactly one silent refresh before giving up. Prevents an
// infinite loop by marking the request as already-retried.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem("accessToken", data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
