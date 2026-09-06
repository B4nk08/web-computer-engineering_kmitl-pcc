"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAccessToken } from "@/lib/api";
import { fetchMe, logout as clearSession } from "../api";
import { isAuthBypassEnabled } from "../config/env";
import type { AuthUser } from "../types";

/** user ปลอมตอน AUTH_BYPASS — ให้เข้า /admin ได้โดยไม่ login */
const BYPASS_USER: AuthUser = {
  id: "auth-bypass",
  email: "dev@local",
  displayName: "Dev (bypass)",
  avatarUrl: "",
  role: "admin",
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const bypass = isAuthBypassEnabled();
  const [user, setUser] = useState<AuthUser | null>(bypass ? BYPASS_USER : null);
  const [loading, setLoading] = useState(!bypass);

  const refresh = useCallback(async () => {
    if (isAuthBypassEnabled()) {
      setUser(BYPASS_USER);
      setLoading(false);
      return;
    }
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    if (isAuthBypassEnabled()) {
      setUser(BYPASS_USER);
      return;
    }
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      refresh,
      setUser,
      logout,
    }),
    [user, loading, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth ต้องอยู่ภายใต้ AuthProvider");
  }
  return ctx;
}
