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
import { useRouter } from "next/navigation";
import { api, setUnauthorizedHandler } from "@/lib/api";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const res = await api.get<User>("/auth/me", { skipAuthRefresh: true });
        if (active && res.success) setUser(res.data);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      router.replace("/login");
    });
    return () => setUnauthorizedHandler(null);
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<User>("/auth/me", { skipAuthRefresh: true });
      if (res.success) setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string }>(
      "/auth/login",
      { email, password },
      { skipAuthRefresh: true }
    );
    const me = await api.get<User>("/auth/me", { skipAuthRefresh: true });
    setUser(me.data);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await api.post<User>(
      "/auth/register",
      { name, email, password },
      { skipAuthRefresh: true }
    );
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", undefined, { skipAuthRefresh: true });
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
    router.replace("/");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}