"use client";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  type AdminUser,
  type LoginCredentials,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "adminToken";

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getCurrentAdmin();
      setUser(response.data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
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
        const response = await loginAdmin(credentials);
        localStorage.setItem(TOKEN_KEY, response.data.token);
        setUser(response.data.user);
        router.push("/admin/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutAdmin();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsLoading(false);
      router.push("/");
    }
  }, [router]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth, // ✅ now it exists here
  };
}
