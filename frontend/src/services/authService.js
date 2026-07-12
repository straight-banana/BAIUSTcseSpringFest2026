import { api } from "./api.js";

// Matches backend/src/routes/authRoutes.js. Every response follows the
// shared { success, data, error, message } envelope (contracts/types.md).

export async function register({ email, password }) {
  const { data } = await api.post("/auth/register", { email, password });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function refresh(refreshToken) {
  const { data } = await api.post("/auth/refresh", { refreshToken });
  return data;
}

export async function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
