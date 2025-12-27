"use client";

import { useCategories } from "@/hooks/use-categories";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function AdminMenuItemsPage() {
  const { items: categories, isLoading: catLoading } = useCategories();
  const { items, isLoading, isCreating, error, add, refresh } = useMenuItems();

  const [categoryId, setCategoryId] = useState("");

  const [nameEn, setNameEn] = useState("");
  const [nameNl, setNameNl] = useState("");
  const [nameDe, setNameDe] = useState("");

  const [descEn, setDescEn] = useState("");
  const [descNl, setDescNl] = useState("");
  const [descDe, setDescDe] = useState("");

  const [amount, setAmount] = useState<number>(1299);
  const [currency, setCurrency] = useState("EUR");

  const [available, setAvailable] = useState(true);
  const [isMainDish, setIsMainDish] = useState(true);

  const [spicy, setSpicy] = useState(false);
  const [nuts, setNuts] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const canSubmit = useMemo(() => {
    return (
      categoryId.trim().length > 0 &&
      nameEn.trim() &&
      nameNl.trim() &&
      nameDe.trim() &&
      descEn.trim() &&
      descNl.trim() &&
      descDe.trim() &&
      Number.isFinite(amount) &&
      currency.trim().length > 0
    );
  }, [
    categoryId,
    nameEn,
    nameNl,
    nameDe,
    descEn,
    descNl,
    descDe,
    amount,
    currency,
  ]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();

    await add({
      categoryId,
      name: { en: nameEn.trim(), nl: nameNl.trim(), de: nameDe.trim() },
      description: { en: descEn.trim(), nl: descNl.trim(), de: descDe.trim() },
      price: { amount: Number(amount), currency: currency.trim() },
      available,
      isMainDish,
      spicy,
      nuts,
      glutenFree,
      vegetarian,
      vegan,
      imageUrl: imageUrl.trim() || undefined,
    });

    // reset (keep currency default)
    setCategoryId("");
    setNameEn("");
    setNameNl("");
    setNameDe("");
    setDescEn("");
    setDescNl("");
    setDescDe("");
    setAmount(1299);
    setAvailable(true);
    setIsMainDish(true);
    setSpicy(false);
    setNuts(false);
    setGlutenFree(false);
    setVegetarian(false);
    setVegan(false);
    setImageUrl("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Menu items</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage menu items.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create menu item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
            {/* Category */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={catLoading}
                required
              >
                <option value="">
                  {catLoading ? "Loading..." : "Select a category"}
                </option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name?.en ?? c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (EN)</label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (NL)</label>
              <Input
                value={nameNl}
                onChange={(e) => setNameNl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (DE)</label>
              <Input
                value={nameDe}
                onChange={(e) => setNameDe(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (EN)</label>
              <Input
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (NL)</label>
              <Input
                value={descNl}
                onChange={(e) => setDescNl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (DE)</label>
              <Input
                value={descDe}
                onChange={(e) => setDescDe(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Price amount (e.g. 1299 = €12.99)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Image URL (optional)
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Flags */}
            <div className="md:col-span-2 grid gap-3 rounded-md border p-3">
              <ToggleRow
                label="Available"
                value={available}
                onChange={setAvailable}
              />
              <ToggleRow
                label="Main dish"
                value={isMainDish}
                onChange={setIsMainDish}
              />
              <ToggleRow label="Spicy" value={spicy} onChange={setSpicy} />
              <ToggleRow
                label="Contains nuts"
                value={nuts}
                onChange={setNuts}
              />
              <ToggleRow
                label="Gluten free"
                value={glutenFree}
                onChange={setGlutenFree}
              />
              <ToggleRow
                label="Vegetarian"
                value={vegetarian}
                onChange={setVegetarian}
              />
              <ToggleRow label="Vegan" value={vegan} onChange={setVegan} />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={isCreating || !canSubmit}>
                {isCreating ? "Creating..." : "Create item"}
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
          <CardTitle>All items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No items yet.</div>
          ) : (
            <div className="divide-y rounded-md border">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-3"
                >
                  <div>
                    <div className="font-medium">{it.name?.en ?? "-"}</div>
                    <div className="text-xs text-muted-foreground">
                      {it.price?.amount} {it.price?.currency} •{" "}
                      {it.available ? "available" : "unavailable"} •{" "}
                      {it.isMainDish ? "main dish" : "other"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{it.id}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
