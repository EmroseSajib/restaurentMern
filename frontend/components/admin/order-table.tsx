"use client"

import { useTranslations } from "next-intl"
import { Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatusBadge } from "./order-status-badge"
import type { Order, OrderStatus } from "@/lib/api"

interface OrderTableProps {
  orders: Order[]
  onStatusChange?: (orderId: string, status: OrderStatus) => void
  onViewDetails?: (order: Order) => void
}

const statusOptions: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]

export function OrderTable({ orders, onStatusChange, onViewDetails }: OrderTableProps) {
  const t = useTranslations("admin")

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                </div>
              </TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell className="font-semibold">
                {"€"}
                {order.total.toFixed(2)}
              </TableCell>
              <TableCell>
                {onStatusChange ? (
                  <Select
                    value={order.status}
                    onValueChange={(value) => onStatusChange(order._id, value as OrderStatus)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`orderStatus.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <OrderStatusBadge status={order.status} />
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(order)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
