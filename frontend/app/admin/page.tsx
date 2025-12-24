"use client"

import { useTranslations } from "next-intl"
import { useOrders } from "@/hooks/use-orders"
import { AdminStatCard } from "@/components/admin/admin-stat-card"
import { OrderTable } from "@/components/admin/order-table"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const t = useTranslations("admin")
  const { orders, isLoading, updateOrderStatus } = useOrders()

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  const recentOrders = orders.slice(0, 10)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
        <SkeletonLoader className="h-96" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("dashboard")}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title={t("totalOrders")} value={stats.total} icon={ShoppingBag} variant="default" />
        <AdminStatCard title={t("pendingOrders")} value={stats.pending} icon={Clock} variant="warning" />
        <AdminStatCard title={t("completedOrders")} value={stats.completed} icon={CheckCircle} variant="success" />
        <AdminStatCard title={t("cancelledOrders")} value={stats.cancelled} icon={XCircle} variant="danger" />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t("recentOrders")}</h2>
        <OrderTable orders={recentOrders} onStatusChange={updateOrderStatus} />
      </div>
    </div>
  )
}
