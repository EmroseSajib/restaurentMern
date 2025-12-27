// "use client";

// import { AdminStatCard } from "@/components/admin/admin-stat-card";
// import { SkeletonLoader } from "@/components/ui/skeleton-loader";
// import { useOrders } from "@/hooks/use-orders";
// import { CheckCircle, Clock, ShoppingBag, XCircle } from "lucide-react";
// import { useTranslations } from "next-intl";

// export default function AdminDashboardPage() {
//   const t = useTranslations("admin");
//   const { orders, isLoading, updateOrderStatus } = useOrders();

//   const stats = {
//     total: orders.length,
//     pending: orders.filter((o) => o.status === "pending").length,
//     completed: orders.filter((o) => o.status === "completed").length,
//     cancelled: orders.filter((o) => o.status === "cancelled").length,
//   };

//   const recentOrders = orders.slice(0, 10);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col gap-6">
//         <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, i) => (
//             <SkeletonLoader key={i} className="h-28" />
//           ))}
//         </div>
//         <SkeletonLoader className="h-96" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <h1 className="text-2xl font-bold">{t("dashboard")}</h1>

//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <AdminStatCard
//           title={t("totalOrders")}
//           value={stats.total}
//           icon={ShoppingBag}
//           variant="default"
//         />
//         <AdminStatCard
//           title={t("pendingOrders")}
//           value={stats.pending}
//           icon={Clock}
//           variant="warning"
//         />
//         <AdminStatCard
//           title={t("completedOrders")}
//           value={stats.completed}
//           icon={CheckCircle}
//           variant="success"
//         />
//         <AdminStatCard
//           title={t("cancelledOrders")}
//           value={stats.cancelled}
//           icon={XCircle}
//           variant="danger"
//         />
//       </div>
//       {/*
//       <div className="flex flex-col gap-4">
//         <h2 className="text-lg font-semibold">{t("recentOrders")}</h2>
//         <OrderTable orders={recentOrders} onStatusChange={updateOrderStatus} />
//       </div> */}
//     </div>
//   );
// }

"use client";

import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function centsToEUR(cents: number) {
  return (cents / 100).toFixed(2);
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">No data</div>;

  const revenueSeries = data.charts.revenueByDay.map((x) => ({
    date: x.date,
    value: x.amount / 100,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard
          title="Revenue today"
          value={`€${centsToEUR(data.kpis.revenueToday)}`}
        />
        <AdminStatCard
          title="Orders today"
          value={String(data.kpis.ordersToday)}
        />
        <AdminStatCard
          title="Reservations today"
          value={String(data.kpis.reservationsToday)}
        />
        <AdminStatCard
          title="Catering today"
          value={String(data.kpis.cateringToday)}
        />
      </div>

      <div className="rounded-xl border p-4">
        <div className="mb-3 font-medium">Revenue (last 7 days)</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* You can render latest orders table here */}
    </div>
  );
}
