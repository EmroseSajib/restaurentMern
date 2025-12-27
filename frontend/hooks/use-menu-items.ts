"use client";

import {
  createMenuItem,
  CreateMenuItemInput,
  getMenuItems,
  MenuItem,
} from "@/lib/api/endpoints/menu-items.api";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getMenuItems();
      setItems(res.data || []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (input: CreateMenuItemInput) => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await createMenuItem(input);
      setItems((prev) => [res.data, ...prev]);
      return res.data;
    } catch (e: any) {
      setError(e?.message ?? "Failed to create menu item");
      throw e;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return useMemo(
    () => ({ items, isLoading, isCreating, error, add, refresh }),
    [items, isLoading, isCreating, error, add, refresh]
  );
}
