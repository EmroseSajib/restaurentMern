import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

function formatMoney(value) {
  // You can change currency as you want
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

async function getMenu({ page, limit }) {
  const url = `${API_BASE_URL}/v1/menu?page=${page}&limit=${limit}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to load menu list");
  }

  return data.data; // { page, limit, total, items }
}

export default async function AdminMenuListPage({ searchParams }) {
  const page = Math.max(1, Number(searchParams?.page || 1));
  const limit = Math.max(1, Number(searchParams?.limit || 24));

  const data = await getMenu({ page, limit });

  const total = Number(data?.total || 0);
  const items = data?.items || [];
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const makeHref = (p) => {
    const qs = new URLSearchParams({
      page: String(p),
      limit: String(limit),
    });
    return `/admin/menu?${qs.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header + create */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-sm text-muted-foreground">Total: {total} items</p>
        </div>

        <Link
          href="/admin/menu/new"
          className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold"
        >
          + Create Menu
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr className="text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Name (EN)</th>
              <th className="p-3">CategoryId</th>
              <th className="p-3">Price</th>
              <th className="p-3">Available</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Sort</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={7}>
                  No menu items found
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr key={m.id} className="border-b last:border-b-0">
                  <td className="p-3">
                    {m.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.imageUrl}
                        alt={m?.name?.en || "menu"}
                        className="h-12 w-12 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-zinc-100 border" />
                    )}
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{m?.name?.en || "-"}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {m?.description?.en || ""}
                    </div>
                  </td>

                  <td className="p-3 font-mono text-xs">{m.categoryId}</td>

                  <td className="p-3">{formatMoney(m.price)}</td>

                  <td className="p-3">
                    <span
                      className={
                        "rounded-full px-2 py-1 text-xs font-semibold " +
                        (m.available
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800")
                      }
                    >
                      {m.available ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {m.isMainDish ? <Tag>main</Tag> : null}
                      {m.vegetarian ? <Tag>veg</Tag> : null}
                      {m.vegan ? <Tag>vegan</Tag> : null}
                      {m.glutenFree ? <Tag>gluten-free</Tag> : null}
                      {m.spicy ? <Tag>spicy</Tag> : null}
                      {m.nuts ? <Tag>nuts</Tag> : null}
                      {!m.isMainDish &&
                      !m.vegetarian &&
                      !m.vegan &&
                      !m.glutenFree &&
                      !m.spicy &&
                      !m.nuts ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : null}
                    </div>
                  </td>

                  <td className="p-3">{m.sortOrder ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {data.page} of {totalPages}
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

function Tag({ children }) {
  return (
    <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-semibold">
      {children}
    </span>
  );
}
