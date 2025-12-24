"use client"

import useSWR from "swr"
import { getMenu, getCategories, searchMenu, type MenuItem, type MenuCategory } from "@/lib/api"

export function useMenu() {
  const { data, error, isLoading, mutate } = useSWR<{ data: MenuItem[] }>("menu", () => getMenu())

  return {
    menu: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useCategories() {
  const { data, error, isLoading } = useSWR<{ data: MenuCategory[] }>("categories", () => getCategories())

  return {
    categories: data?.data || [],
    isLoading,
    error,
  }
}

export function useMenuSearch(query: string) {
  const { data, error, isLoading } = useSWR<{ data: MenuItem[] }>(query ? ["menu-search", query] : null, () =>
    searchMenu(query),
  )

  return {
    results: data?.data || [],
    isLoading,
    error,
  }
}
