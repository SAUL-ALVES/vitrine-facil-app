import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = authService.getSession();
    if (session?.token && authService.isTokenValid(session.token)) {
      setUser(session.user);
      setToken(session.token);
    } else {
      authService.clearSession();
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  function register(data) {
    const { user: u, token: t } = authService.register(data);
    setUser(u);
    setToken(t);
    return { user: u, token: t };
  }

  function login(data) {
    const { user: u, token: t } = authService.login(data);
    setUser(u);
    setToken(t);
    return { user: u, token: t };
  }

  function logout() {
    authService.clearSession();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: !!user && !!token, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
