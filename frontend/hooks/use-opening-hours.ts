"use client"

import useSWR from "swr"
import {
  getOpeningHours,
  getDeliveryHours,
  getSettings,
  type OpeningHours,
  type DeliveryHours,
  type RestaurantSettings,
} from "@/lib/api"

export function useOpeningHours() {
  const { data, error, isLoading } = useSWR<{ data: OpeningHours[] }>("opening-hours", () => getOpeningHours())

  return {
    openingHours: data?.data || [],
    isLoading,
    error,
  }
}

export function useDeliveryHours() {
  const { data, error, isLoading } = useSWR<{ data: DeliveryHours[] }>("delivery-hours", () => getDeliveryHours())

  return {
    deliveryHours: data?.data || [],
    isLoading,
    error,
  }
}

export function useSettings() {
  const { data, error, isLoading } = useSWR<{ data: RestaurantSettings }>("settings", () => getSettings())

  return {
    settings: data?.data,
    isLoading,
    error,
  }
}
