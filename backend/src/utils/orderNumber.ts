export function generateOrderNumber() {
  // Example: ORD-20260117-483921
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${y}${m}${day}-${rand}`;
}
