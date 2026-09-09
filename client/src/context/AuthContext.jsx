import { createContext, useContext, useEffect, useState } from "react";
import { authApi, getErrorMessage } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function register({ name, email, password }) {
    try {
      const { data } = await authApi.register({ name, email, password });
      persistSession(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  async function login({ email, password }) {
    try {
      const { data } = await authApi.login({ email, password });
      persistSession(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  function persistSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
