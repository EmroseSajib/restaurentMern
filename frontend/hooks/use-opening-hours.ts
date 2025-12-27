"use client";

import useSWR from "swr";
import { getOpeningHours, getSettings, type WeeklyHours, type SettingsPayload } from "@/lib/api";

export function useOpeningHours() {
  const { data, error, isLoading } = useSWR("opening-hours", () => getOpeningHours());

  return {
    openingHours: (data?.data as any)?.openingHours as WeeklyHours | undefined,
    deliveryHours: (data?.data as any)?.deliveryHours as WeeklyHours | undefined,
    isLoading,
    error,
  };
}

export function useSettings() {
  const { data, error, isLoading } = useSWR("settings", () => getSettings());

  return {
    settings: data?.data as SettingsPayload | undefined,
    isLoading,
    error,
  };
}
