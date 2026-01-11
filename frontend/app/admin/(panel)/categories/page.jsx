import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCategories() {
  const res = await fetch("/admin/menu/categories", {
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to load categories");
  }
  return data?.data || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage menu categories
          </p>
        </div>

        <Link
          href="/admin/menu/categories/new"
          className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold"
        >
          + Add Category
        </Link>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-zinc-50">
              <tr className="text-left">
                <th className="p-3">Sort</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Name (EN)</th>
                <th className="p-3">Name (NL)</th>
                <th className="p-3">Name (DE)</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td className="p-4 text-muted-foreground" colSpan={5}>
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b last:border-b-0">
                    <td className="p-3">{c.sortOrder}</td>
                    <td className="p-3 font-mono">{c.slug}</td>
                    <td className="p-3">{c?.name?.en}</td>
                    <td className="p-3">{c?.name?.nl}</td>
                    <td className="p-3">{c?.name?.de}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
