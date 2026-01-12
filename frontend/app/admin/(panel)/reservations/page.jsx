import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

function fmtDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

async function getReservations({ page, limit, status }) {
  // Next 16: cookies() is async
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;

  if (!token) redirect("/admin/login");

  const url = `${API_BASE_URL}/v1/reservations/admin?page=${page}&limit=${limit}&status=${status}`;

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
    throw new Error(data?.message || "Failed to load reservations");
  }

  return data.data; // { page, limit, total, items }
}

export default async function ReservationsPage({ searchParams }) {
  const page = Math.max(1, Number(searchParams?.page || 1));
  const limit = Math.max(1, Number(searchParams?.limit || 20));
  const status = searchParams?.status || "new";

  const data = await getReservations({ page, limit, status });

  const total = Number(data?.total || 0);
  const items = data?.items || [];
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const makeHref = (p) => {
    const qs = new URLSearchParams({
      page: String(p),
      limit: String(limit),
      status: String(status),
    });
    return `/admin/reservations?${qs.toString()}`;
  };

  const statuses = ["new", "confirmed", "cancelled", "completed"];

  return (
    <div className="space-y-6">
      {/* Header + status filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming table reservations
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => {
            const active = s === status;
            return (
              <Link
                key={s}
                href={`/admin/reservations?page=1&limit=${limit}&status=${s}`}
                className={
                  "rounded-lg px-3 py-2 text-sm font-semibold border transition " +
                  (active
                    ? "bg-black text-white border-black"
                    : "bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-200")
                }
              >
                {s}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr className="text-left">
              <th className="p-3">Customer</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Party</th>
              <th className="p-3">Reservation</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={7}>
                  No reservations found
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">
                    {r.customer?.name || "Guest"}
                  </td>

                  <td className="p-3">
                    <div className="text-xs text-muted-foreground">
                      {r.customer?.phone || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.customer?.email || "-"}
                    </div>
                  </td>

                  <td className="p-3">{r.partySize ?? "-"}</td>

                  <td className="p-3">{fmtDateTime(r.reservationAt)}</td>

                  <td className="p-3 max-w-[360px]">
                    <div className="truncate" title={r.notes || ""}>
                      {r.notes || "-"}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-1 text-xs font-semibold">
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3">{fmtDateTime(r.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {data.page} of {totalPages} • Total {total}
        </div>

        <div className="flex gap-2">
          <Link
            href={makeHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={
              "rounded-lg border px-3 py-2 text-sm font-semibold " +
              (page <= 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-zinc-50")
            }
          >
            Prev
          </Link>

          <Link
            href={makeHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={
              "rounded-lg border px-3 py-2 text-sm font-semibold " +
              (page >= totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-zinc-50")
            }
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
