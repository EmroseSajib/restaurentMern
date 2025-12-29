"use client";

import {
  CategoryDto,
  getMenu,
  getMenuCategories,
  MenuItemDto,
  MenuQueryParams,
} from "@/lib/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useCategoriesData() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getMenuCategories();
      const data = (res.data ?? [])
        .slice()
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setCategories(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return useMemo(
    () => ({ categories, isLoading, error, refresh }),
    [categories, isLoading, error, refresh]
  );
}

export function useMenuData(params: MenuQueryParams) {
  const [items, setItems] = useState<MenuItemDto[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: params.limit ?? 24,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // to avoid out-of-order responses
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(
    async (p: number, replace: boolean) => {
      const requestId = ++requestIdRef.current;

      setIsLoading(true);
      setError(null);
      try {
        const res = await getMenu({
          ...params,
          page: p,
          limit: params.limit ?? 24,
        });
        if (requestId !== requestIdRef.current) return; // ignore stale response

        const data = res.data;
        setMeta({ page: data.page, limit: data.limit, total: data.total });

        setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
      } catch (e: any) {
        if (requestId !== requestIdRef.current) return;
        setError(e?.message ?? "Failed to load menu");
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [params]
  );

  // whenever filters change, reset to page 1
  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.category,
    params.q,
    params.available,
    params.spicy,
    params.vegetarian,
    params.vegan,
    params.glutenFree,
    params.nuts,
    params.limit,
  ]);

  const loadMore = useCallback(async () => {
    const next = meta.page + 1;
    if (items.length >= meta.total) return;
    await fetchPage(next, false);
  }, [fetchPage, items.length, meta.page, meta.total]);

  const hasMore = items.length < meta.total;

  return useMemo(
    () => ({
      items,
      meta,
      isLoading,
      error,
      loadMore,
      hasMore,
      refetch: () => fetchPage(1, true),
    }),
    [items, meta, isLoading, error, loadMore, hasMore, fetchPage]
  );
}
