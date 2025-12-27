"use client";

import {
  createCategory,
  getCategories,
  type CreateCategoryInput,
  type MenuCategory,
} from "@/lib/api/endpoints/category.api";
import { useCallback, useEffect, useState } from "react";

export function useCategories() {
  const [items, setItems] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      setItems(res.data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (input: CreateCategoryInput) => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await createCategory(input);
      // optimistic append; or call refresh()
      setItems((prev) => [res.data, ...prev]);
      return res.data;
    } catch (e: any) {
      setError(e?.message ?? "Failed to create category");
      throw e;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { items, isLoading, isCreating, error, refresh, add };
}
