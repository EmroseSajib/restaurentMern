"use client";

import {
  getCurrentAdmin,
  getStoredAccessToken,
  loginAdmin,
  logoutAdmin,
  refreshAdmin,
  storeAccessToken,
  type AdminUser,
  type LoginCredentials,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AdminAuthContextValue = {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const token = getStoredAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await getCurrentAdmin(token);
      // adjust if your backend returns different shape
      setUser(me.data.admin);
    } catch {
      try {
        const refreshed = await refreshAdmin(); // uses httpOnly cookie
        storeAccessToken(refreshed.data.accessToken);
        setUser(refreshed.data.admin);
      } catch {
        storeAccessToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await loginAdmin(credentials);

        storeAccessToken(res.data.accessToken);
        setUser(res.data.admin);

        router.replace("/admin");
      } catch (err) {
        storeAccessToken(null);
        setUser(null);
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    // instant UI update
    setUser(null);
    setError(null);
    storeAccessToken(null);

    try {
      await logoutAdmin(); // must include credentials: "include"
    } catch {
      // ignore
    } finally {
      router.replace("/admin/login");
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuth,
    }),
    [user, isLoading, error, login, logout, checkAuth]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
