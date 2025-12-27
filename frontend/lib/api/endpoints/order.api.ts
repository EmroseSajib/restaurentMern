import { apiClient, type ApiResponse } from "../client";
import type { Money } from "./order.api";
export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "stripe" | "cod";
export type DeliveryType = "delivery" | "pickup";
export type PaymentMethod = "stripe" | "cod";
export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string };
  fulfillment: { type: "delivery" | "pickup" };
  totals: { total: Money };
  payment: { method: PaymentMethod; status: PaymentStatus };
};
export interface CreateOrderInput {
  customer: { name: string; phone: string; email?: string };
  fulfillment: {
    type: DeliveryType;
    address?: {
      line1?: string;
      postalCode?: string;
      city?: string;
      country?: string;
    };
    notes?: string;
  };
  items: { menuItemId: string; quantity: number }[];
  bonus?: "rice" | "naan" | "none";
  voucherCode?: string;
  membershipId?: string;
  paymentMethod: PaymentMethod;
}

export interface Money {
  amount: number; // cents
  currency: string;
}

export interface CreateOrderResult {
  id: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  total: Money;
  allMainDishEligible: boolean;
  bonusApplied: "rice" | "naan" | "none";
}

export async function createOrder(
  input: CreateOrderInput
): Promise<ApiResponse<CreateOrderResult>> {
  return apiClient.post<ApiResponse<CreateOrderResult>>("/orders", input);
}
export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  q?: string;
}): Promise<
  ApiResponse<{
    page: number;
    limit: number;
    total: number;
    items: AdminOrderListItem[];
  }>
> {
  return apiClient.get("/admin/orders", { params });
}
export async function getOrder(id: string) {
  return apiClient.get(`/admin/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return apiClient.patch(`/admin/orders/${id}/status`, { status });
}
export interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  customer: { name: string; phone: string; email: string };
  fulfillment: any;
  items: any[];
  bonus: any;
  discounts: any;
  totals: { subtotal: Money; total: Money };
  payment: { method: PaymentMethod; status: string };
  createdAt: string;
}

export async function getOrderById(
  id: string
): Promise<ApiResponse<OrderDetails>> {
  return apiClient.get<ApiResponse<OrderDetails>>(`/orders/${id}`);
}

export async function createStripeCheckout(
  orderId: string
): Promise<ApiResponse<{ url: string }>> {
  return apiClient.post<ApiResponse<{ url: string }>>(
    `/orders/${orderId}/stripe/checkout`
  );
}
