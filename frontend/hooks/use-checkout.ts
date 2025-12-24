"use client"

import { useState, useCallback } from "react"
import {
  createOrder,
  validateVoucher,
  validateMembership,
  type CreateOrderData,
  type DeliveryType,
  type PaymentMethod,
} from "@/lib/api"
import { useCart, type FreeBonus } from "./use-cart"

export interface CheckoutState {
  deliveryType: DeliveryType
  paymentMethod: PaymentMethod
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  notes: string
  voucherCode: string
  membershipId: string
  voucherDiscount: number
  membershipDiscount: number
  deliveryFee: number
}

const DELIVERY_FEE = 3.5
const FREE_DELIVERY_THRESHOLD = 35

export function useCheckout() {
  const { items, subtotal, clearCart, freeBonus } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [state, setState] = useState<CheckoutState>({
    deliveryType: "delivery",
    paymentMethod: "stripe",
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
    notes: "",
    voucherCode: "",
    membershipId: "",
    voucherDiscount: 0,
    membershipDiscount: 0,
    deliveryFee: DELIVERY_FEE,
  })

  const updateField = useCallback(<K extends keyof CheckoutState>(field: K, value: CheckoutState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateCustomer = useCallback((field: keyof CheckoutState["customer"], value: string) => {
    setState((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
    }))
  }, [])

  const applyVoucher = useCallback(
    async (code: string) => {
      if (!code.trim()) return
      setIsLoading(true)
      setError(null)
      try {
        const response = await validateVoucher(code)
        if (response.data.valid && response.data.voucher) {
          setState((prev) => ({
            ...prev,
            voucherCode: code,
            voucherDiscount: Math.min(response.data.voucher!.balance, subtotal),
          }))
        } else {
          setError(response.data.message || "Invalid voucher code")
        }
      } catch {
        setError("Failed to validate voucher")
      } finally {
        setIsLoading(false)
      }
    },
    [subtotal],
  )

  const applyMembership = useCallback(
    async (memberId: string) => {
      if (!memberId.trim()) return
      setIsLoading(true)
      setError(null)
      try {
        const response = await validateMembership(memberId)
        if (response.data.valid && response.data.discount) {
          setState((prev) => ({
            ...prev,
            membershipId: memberId,
            membershipDiscount: (subtotal * response.data.discount!) / 100,
          }))
        } else {
          setError(response.data.message || "Invalid membership ID")
        }
      } catch {
        setError("Failed to validate membership")
      } finally {
        setIsLoading(false)
      }
    },
    [subtotal],
  )

  const calculateDeliveryFee = useCallback(() => {
    if (state.deliveryType === "pickup") return 0
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0
    return DELIVERY_FEE
  }, [state.deliveryType, subtotal])

  const total = subtotal - state.voucherDiscount - state.membershipDiscount + calculateDeliveryFee()

  const placeOrder = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const orderData: CreateOrderData = {
        items: items.map((item) => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          price: item.menuItem.price,
          notes: item.notes,
        })),
        customer:
          state.deliveryType === "delivery"
            ? state.customer
            : {
                name: state.customer.name,
                email: state.customer.email,
                phone: state.customer.phone,
              },
        deliveryType: state.deliveryType,
        paymentMethod: state.paymentMethod,
        notes: state.notes,
        voucherCode: state.voucherCode || undefined,
        membershipId: state.membershipId || undefined,
        freeBonus: (freeBonus as FreeBonus) || undefined,
      }

      const response = await createOrder(orderData)
      clearCart()
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [items, state, freeBonus, clearCart])

  return {
    state,
    updateField,
    updateCustomer,
    applyVoucher,
    applyMembership,
    placeOrder,
    isLoading,
    error,
    subtotal,
    deliveryFee: calculateDeliveryFee(),
    total,
  }
}
