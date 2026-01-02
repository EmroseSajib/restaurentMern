export async function adminLogin({ username, password }) {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    return {
      ok: false,
      message: data?.message || data?.error || "Invalid credentials",
    };
  }

  return { ok: true, admin: data.admin };
}
