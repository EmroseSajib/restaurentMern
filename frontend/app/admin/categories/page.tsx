"use client";

import { useCategories } from "@/hooks/use-categories";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminCategoriesPage() {
  const { items, isLoading, isCreating, error, add, refresh } = useCategories();

  // ✅ 3 required language fields
  const [nameEn, setNameEn] = useState("");
  const [nameNl, setNameNl] = useState("");
  const [nameDe, setNameDe] = useState("");

  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();

    // ✅ slug fallback from EN name
    const finalSlug = slug.trim() || slugify(nameEn);

    await add({
      name: {
        en: nameEn.trim(),
        nl: nameNl.trim(),
        de: nameDe.trim(),
      },
      slug: finalSlug,
      sortOrder,
      isActive,
    });

    setNameEn("");
    setNameNl("");
    setNameDe("");
    setSlug("");
    setSortOrder(0);
    setIsActive(true);
  }

  const canSubmit =
    nameEn.trim().length > 0 &&
    nameNl.trim().length > 0 &&
    nameDe.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage menu categories.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
            {/* ✅ Name fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (EN)</label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                placeholder="Main Dishes"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name (NL)</label>
              <Input
                value={nameNl}
                onChange={(e) => setNameNl(e.target.value)}
                required
                placeholder="Hoofdgerechten"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name (DE)</label>
              <Input
                value={nameDe}
                onChange={(e) => setNameDe(e.target.value)}
                required
                placeholder="Hauptgerichte"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Slug (optional, auto from EN)
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. main-dishes"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort order</label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <span className="text-sm">Active</span>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isCreating || !canSubmit}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>

            {error ? (
              <div className="md:col-span-2 text-sm text-red-600">{error}</div>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No categories yet.
            </div>
          ) : (
            <div className="divide-y rounded-md border">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3"
                >
                  <div>
                    {/* ✅ show EN name primarily */}
                    <div className="font-medium">{c.name?.en ?? "-"}</div>

                    {/* ✅ show all 3 languages */}
                    <div className="text-xs text-muted-foreground">
                      EN: {c.name?.en ?? "-"} • NL: {c.name?.nl ?? "-"} • DE:{" "}
                      {c.name?.de ?? "-"}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      slug: {c.slug} • sort: {c.sortOrder} •{" "}
                      {c.isActive ? "active" : "inactive"}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">{c.id}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
