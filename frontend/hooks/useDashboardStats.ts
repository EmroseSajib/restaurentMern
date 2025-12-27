"use client";

import {
  getDashboardStats,
  type DashboardStats,
} from "@/lib/api/endpoints/adminDashboard.api";
import { useEffect, useState } from "react";

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getDashboardStats();
        if (mounted) setData(res.data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load dashboard");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
