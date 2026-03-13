import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { authService } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        const session = await authService.getCurrentSession(firebaseUser);
        setUser(session?.user || null);
        setToken(session?.token || null);
      } catch (error) {
        console.error("Erro ao recuperar sessão do Firebase:", error);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function register(data) {
    const { user: newUser, token: newToken } = await authService.register(data);
    setUser(newUser);
    setToken(newToken);
    return { user: newUser, token: newToken };
  }

  async function login(data) {
    const { user: newUser, token: newToken } = await authService.login(data);
    setUser(newUser);
    setToken(newToken);
    return { user: newUser, token: newToken };
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}