"use client"

import { useTranslations } from "next-intl"
import { Modal } from "@/components/ui/modal"
import { OrderStatusBadge } from "./order-status-badge"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/api"

interface OrderDetailsModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  const t = useTranslations()

  if (!order) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`Order #${order.orderNumber}`} size="lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <OrderStatusBadge status={order.status} />
          <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Customer Details</h4>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Name:</span> {order.customer.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span> {order.customer.email}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span> {order.customer.phone}
            </p>
            {order.customer.address && (
              <p>
                <span className="text-muted-foreground">Address:</span> {order.customer.address}, {order.customer.city}{" "}
                {order.customer.postalCode}
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-2">Order Items</h4>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>
                  {"€"}
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {"€"}
              {order.subtotal.toFixed(2)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>
                -{"€"}
                {order.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? t("common.free") : `€${order.deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">
              {"€"}
              {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {order.notes && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Order Notes</h4>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
