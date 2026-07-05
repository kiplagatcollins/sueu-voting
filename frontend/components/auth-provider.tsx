"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Voter } from "@/lib/types";

interface AuthContextType {
  voter: Voter | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!api.getToken()) {
      setVoter(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.getProfile();
      setVoter(profile);
    } catch {
      api.setToken(null);
      setVoter(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await api.login(email, password);
    setVoter(resp.voter);
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    setVoter(null);
  }, []);

  return (
    <AuthContext.Provider value={{ voter, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
