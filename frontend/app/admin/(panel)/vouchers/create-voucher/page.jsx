"use client";

import { useMemo, useState } from "react";

// helpers
const toLocal = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

const toISO = (val) => (val ? new Date(val).toISOString() : "");

export default function NewVoucherPage() {
  const [form, setForm] = useState({
    code: "",
    type: "fixed",
    value: 0,
    minOrderAmount: 0,
    startsAt: "",
    endsAt: "",
    maxRedemptions: 1,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const preview = useMemo(() => {
    const d = form.type === "fixed" ? `€${form.value}` : `${form.value}%`;
    return `${form.code || "CODE"} • ${d} • Min €${form.minOrderAmount}`;
  }, [form]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");

    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          minOrderAmount: Number(form.minOrderAmount),
          maxRedemptions: Number(form.maxRedemptions),
          startsAt: toISO(form.startsAt),
          endsAt: toISO(form.endsAt),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // show backend message if exists
        throw new Error(data?.message || "Failed to create voucher");
      }

      setMsg("Voucher created successfully ✅");
    } catch (err) {
      setError(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-neutral-500">Admin Panel</p>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Create Voucher
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-neutral-500">Preview</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium">
              {preview}
            </span>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            {/* Code & Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Code">
                <input
                  required
                  value={form.code}
                  onChange={(e) => update("code", e.target.value)}
                />
              </Input>

              <Input label="Type">
                <select
                  value={form.type}
                  onChange={(e) => update("type", e.target.value)}
                >
                  <option value="fixed">Fixed</option>
                  <option value="percent">Percent</option>
                </select>
              </Input>
            </div>

            {/* Values */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Value">
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => update("value", e.target.value)}
                />
              </Input>

              <Input label="Min Order">
                <input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => update("minOrderAmount", e.target.value)}
                />
              </Input>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Starts At">
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => update("startsAt", e.target.value)}
                />
              </Input>

              <Input label="Ends At">
                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => update("endsAt", e.target.value)}
                />
              </Input>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm font-medium">Active</span>
              <button
                type="button"
                onClick={() => update("isActive", !form.isActive)}
                className={`h-6 w-11 rounded-full transition ${
                  form.isActive ? "bg-green-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`block h-5 w-5 translate-x-1 rounded-full bg-white transition ${
                    form.isActive && "translate-x-5"
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="rounded-lg bg-neutral-900 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Voucher"}
            </button>

            {msg && (
              <p className="text-center text-sm text-neutral-600">{msg}</p>
            )}
            {error && (
              <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- reusable input ---------- */
function Input({ label, children }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-neutral-600">{label}</span>
      {children && (
        <div className="[&>input,&>select]:w-full [&>input,&>select]:rounded-lg [&>input,&>select]:border [&>input,&>select]:px-3 [&>input,&>select]:py-2 [&>input,&>select]:text-sm focus-within:ring-2 focus-within:ring-neutral-300">
          {children}
        </div>
      )}
    </label>
  );
}
