import { createContext, useContext, useState, useCallback } from "react";
import * as authService from "../services/authService.js";

const AppContext = createContext(null);

// Global app-wide state (user, theme, feature flags, etc). Also owns the
// auth state — logged-in user plus access/refresh tokens — since there's
// no Firebase Auth SDK to do this for us anymore.
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = { user, setUser, login, logout };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
