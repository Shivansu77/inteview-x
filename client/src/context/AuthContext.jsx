import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from stored token
  useEffect(() => {
    authService.getMe().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function login(credentials) {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  }

  async function register(credentials) {
    const data = await authService.register(credentials);
    setUser(data.user);
    return data;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
