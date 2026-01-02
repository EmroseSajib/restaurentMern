function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  return sp.toString();
}

export async function getCategories() {
  const res = await fetch("/api/menu/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Categories request failed");
  return res.json();
}

export async function getMenu(params) {
  const qs = buildQuery(params);
  const res = await fetch(`/api/menu?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Menu request failed");
  return res.json();
}

// IMPORTANT: convert {en,nl,de} -> string
export function localizeText(obj, locale) {
  if (!obj) return "";
  if (typeof obj === "string" || typeof obj === "number") return String(obj);
  if (typeof obj === "object") return obj?.[locale] ?? obj?.en ?? "";
  return "";
}
