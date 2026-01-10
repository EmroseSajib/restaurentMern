// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import useSWR from "swr";

// const fetcher = (url) =>
//   fetch(url, { cache: "no-store" }).then((r) => r.json());

// function formatMoneyEUR(value) {
//   return new Intl.NumberFormat("en-GB", {
//     style: "currency",
//     currency: "EUR",
//   }).format(Number(value || 0));
// }

// function formatDateTime(iso) {
//   if (!iso) return "-";
//   const d = new Date(iso);
//   return new Intl.DateTimeFormat("en-GB", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   }).format(d);
// }

// function KpiCard({ title, value, formatter }) {
//   const display = formatter ? formatter(value) : String(value ?? 0);
//   return (
//     <Card className="border-amber-200/60">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold text-amber-900">{display}</div>
//       </CardContent>
//     </Card>
//   );
// }

// export default function AdminDashboardPage() {
//   const { data, isLoading, error } = useSWR(
//     "/v1/api/admin/dashboard/stats",
//     fetcher,
//     { revalidateOnFocus: false }
//   );

//   if (isLoading)
//     return <div className="text-muted-foreground">Loading dashboard…</div>;
//   if (error || data?.success === false) {
//     return (
//       <div className="text-red-600">
//         {data?.message || "Failed to load dashboard"}
//       </div>
//     );
//   }

//   const kpis = data?.data?.kpis || {};
//   const latestOrders = data?.data?.latest?.orders || [];
//   const latestReservations = data?.data?.latest?.reservations || [];
//   const latestCatering = data?.data?.latest?.catering || [];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
//           Dashboard
//         </h1>
//         <p className="text-muted-foreground">
//           Today overview & latest activity
//         </p>
//       </div>

//       {/* KPI GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <KpiCard
//           title="Revenue Today"
//           value={kpis.revenueToday}
//           formatter={formatMoneyEUR}
//         />
//         <KpiCard title="Orders Today" value={kpis.ordersToday} />
//         <KpiCard title="Reservations Today" value={kpis.reservationsToday} />
//         <KpiCard title="Catering Today" value={kpis.cateringToday} />
//       </div>

//       {/* Latest */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//         {/* Orders */}
//         <Card className="border-amber-200/60">
//           <CardHeader>
//             <CardTitle>Latest Orders</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {latestOrders.length === 0 ? (
//               <div className="text-sm text-muted-foreground">
//                 No recent orders
//               </div>
//             ) : (
//               latestOrders.map((o) => (
//                 <div key={o.id} className="rounded-lg border p-3">
//                   <div className="font-medium">Order #{o.id}</div>
//                   <div className="text-xs text-muted-foreground">
//                     {formatDateTime(o.createdAt)}
//                   </div>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>

//         {/* Reservations */}
//         <Card className="border-amber-200/60">
//           <CardHeader>
//             <CardTitle>Latest Reservations</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {latestReservations.length === 0 ? (
//               <div className="text-sm text-muted-foreground">
//                 No recent reservations
//               </div>
//             ) : (
//               latestReservations.map((r) => (
//                 <div key={r.id} className="rounded-lg border p-3">
//                   <div className="flex items-center justify-between">
//                     <div className="font-semibold">
//                       {r.customer?.name || "Guest"}
//                     </div>
//                     <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-900">
//                       {r.status}
//                     </span>
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     Party: {r.partySize} • {formatDateTime(r.reservationAt)}
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     {r.customer?.phone} • {r.customer?.email}
//                   </div>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>

//         {/* Catering */}
//         <Card className="border-amber-200/60">
//           <CardHeader>
//             <CardTitle>Latest Catering</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {latestCatering.length === 0 ? (
//               <div className="text-sm text-muted-foreground">
//                 No recent catering
//               </div>
//             ) : (
//               latestCatering.map((c) => (
//                 <div key={c.id} className="rounded-lg border p-3">
//                   <div className="flex items-center justify-between">
//                     <div className="font-semibold">
//                       {c.customer?.company || c.customer?.name || "Customer"}
//                     </div>
//                     <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-900">
//                       {c.status}
//                     </span>
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     {c.event?.occasion} • {formatDateTime(c.event?.date)}
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     People: {c.event?.peopleCount} • {c.event?.location}
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     {c.customer?.phone} • {c.customer?.email}
//                   </div>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts placeholders */}
//       <Card className="border-amber-200/60">
//         <CardHeader>
//           <CardTitle>Charts</CardTitle>
//         </CardHeader>
//         <CardContent className="text-sm text-muted-foreground">
//           revenueByDay / ordersByDay are empty now — when your backend sends
//           data, we can render charts (Recharts).
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import AdminDashboardView from "@/components/admin/AdminDashboardView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // no cache

async function getDashboardStats() {
  const cookieStore = await cookies(); // Next 16: async
  const token = cookieStore.get("admin_access_token")?.value;

  if (!token) redirect("/admin/login");
  const base = process.env.API_BASE_URL;
  const url = new URL("/v1/admin/dashboard/stats", base);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) redirect("/admin/login");
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to load dashboard stats");
  }

  return data;
}

export default async function AdminDashboardPage() {
  const data = await getDashboardStats();
  console.log("Dashboard Data:", data);
  return <AdminDashboardView data={data} />;
}
