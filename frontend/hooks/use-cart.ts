"use client";

import type { MenuItem } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

const CART_STORAGE_KEY = "dekleineman-cart";
const FREE_BONUS_KEY = "dekleineman-free-bonus";

export type FreeBonus = "rice" | "naan" | null;

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [freeBonus, setFreeBonusState] = useState<FreeBonus>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const storedBonus = localStorage.getItem(FREE_BONUS_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          setItems([]);
        }
      }
      if (storedBonus) {
        setFreeBonusState(storedBonus as FreeBonus);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      if (freeBonus) {
        localStorage.setItem(FREE_BONUS_KEY, freeBonus);
      } else {
        localStorage.removeItem(FREE_BONUS_KEY);
      }
    }
  }, [freeBonus, isLoaded]);

  const addItem = useCallback(
    (menuItem: MenuItem, quantity = 1, notes?: string) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.menuItem._id === menuItem._id
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          if (notes) updated[existingIndex].notes = notes;
          return updated;
        }
        return [...prev, { menuItem, quantity, notes }];
      });
    },
    []
  );

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((item) => item.menuItem._id !== menuItemId));
  }, []);

  const updateQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(menuItemId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.menuItem._id === menuItemId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setFreeBonusState(null);
  }, []);

  const setFreeBonus = useCallback((bonus: FreeBonus) => {
    setFreeBonusState(bonus);
  }, []);

  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const itemCount = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const allMainDishes =
    items.length > 0 && items.every((item) => item.menuItem.isMainDish);

  const eligibleForFreeBonus = allMainDishes && items.length > 0;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    isLoaded,
    freeBonus,
    setFreeBonus,
    eligibleForFreeBonus,
  };
}
