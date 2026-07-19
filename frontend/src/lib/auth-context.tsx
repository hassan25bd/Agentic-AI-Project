"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiFetch, ApiClientError } from "./api";
import { User } from "./types";

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateLocalUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "voyager_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const applyAuth = (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const data = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    applyAuth(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: { name, email, password },
      auth: false,
    });
    applyAuth(data);
  };

  const loginWithGoogle = async (credential: string) => {
    const data = await apiFetch<AuthResponse>("/auth/google", {
      method: "POST",
      body: { credential },
      auth: false,
    });
    applyAuth(data);
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout
    }
  };

  const updateLocalUser = (patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser: loadMe,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
