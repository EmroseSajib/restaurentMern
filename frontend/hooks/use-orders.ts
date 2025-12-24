"use client"

import useSWR from "swr"
import { getOrders, getOrder, updateOrderStatus, type OrderStatus } from "@/lib/api"

export function useOrders(params?: { status?: OrderStatus; page?: number; limit?: number }) {
  const { data, error, isLoading, mutate } = useSWR(["orders", params], () => getOrders(params))

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status)
    mutate()
  }

  return {
    orders: data?.data.orders || [],
    total: data?.data.total || 0,
    page: data?.data.page || 1,
    pages: data?.data.pages || 1,
    isLoading,
    error,
    mutate,
    updateStatus,
  }
}

export function useOrder(orderNumber: string) {
  const { data, error, isLoading, mutate } = useSWR(orderNumber ? ["order", orderNumber] : null, () =>
    getOrder(orderNumber),
  )

  return {
    order: data?.data,
    isLoading,
    error,
    mutate,
  }
}
