import { apiClient, type ApiResponse } from "../client"

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
export type DeliveryType = "delivery" | "pickup"
export type PaymentMethod = "stripe" | "cod"

export interface OrderItem {
  menuItem: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  customer: {
    name: string
    email: string
    phone: string
    address?: string
    city?: string
    postalCode?: string
  }
  deliveryType: DeliveryType
  paymentMethod: PaymentMethod
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  status: OrderStatus
  notes?: string
  voucherCode?: string
  membershipId?: string
  freeBonus?: "rice" | "naan"
  estimatedTime?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderData {
  items: Omit<OrderItem, "name">[]
  customer: Order["customer"]
  deliveryType: DeliveryType
  paymentMethod: PaymentMethod
  notes?: string
  voucherCode?: string
  membershipId?: string
  freeBonus?: "rice" | "naan"
}

export async function createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
  return apiClient.post<ApiResponse<Order>>("/orders", data)
}

export async function getOrder(orderNumber: string): Promise<ApiResponse<Order>> {
  return apiClient.get<ApiResponse<Order>>(`/orders/${orderNumber}`)
}

export async function getOrders(params?: {
  status?: OrderStatus
  page?: number
  limit?: number
}): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; pages: number }>> {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.append("status", params.status)
  if (params?.page) searchParams.append("page", String(params.page))
  if (params?.limit) searchParams.append("limit", String(params.limit))
  return apiClient.get<ApiResponse<{ orders: Order[]; total: number; page: number; pages: number }>>(
    `/orders?${searchParams.toString()}`,
  )
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ApiResponse<Order>> {
  return apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status })
}
