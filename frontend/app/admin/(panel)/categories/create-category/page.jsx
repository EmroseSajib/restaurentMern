"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    name: { en: "", nl: "", de: "" },
    sortOrder: 1,
  });

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Category</h1>
          <p className="text-sm text-muted-foreground">
            Add a new category (EN/NL/DE)
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/menu/categories")}
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
        >
          Back
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name (EN)</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={form.name.en}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: { ...p.name, en: e.target.value },
              }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Name (NL)</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={form.name.nl}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: { ...p.name, nl: e.target.value },
              }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Name (DE)</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={form.name.de}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: { ...p.name, de: e.target.value },
              }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Slug</label>
          <input
            className="w-full rounded-lg border px-3 py-2 font-mono"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="main-courses"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Sort Order</label>
          <input
            type="number"
            className="w-full rounded-lg border px-3 py-2"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))
            }
            min={1}
          />
        </div>

        <button
          type="button"
          className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold"
          onClick={() => alert("Connect this to POST API later")}
        >
          Create
        </button>
      </div>
    </div>
  );
}
