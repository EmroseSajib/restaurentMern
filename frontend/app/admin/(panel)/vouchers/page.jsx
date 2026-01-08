"use client";

import { useMemo, useState } from "react";
function getCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}
function toDateTimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocalToISO(value) {
  // value looks like: 2025-12-10T00:00
  if (!value) return "";
  // new Date(value) treats it as local time, then toISOString -> UTC "Z"
  return new Date(value).toISOString();
}

export default function NewVoucherPage() {
  const [form, setForm] = useState({
    code: "Hello10",
    type: "fixed",
    value: 10,
    minOrderAmount: 150,

    // store datetime-local values in state (nice for date picker)
    startsAtLocal: toDateTimeLocal("2025-12-10T00:00:00Z"),
    endsAtLocal: toDateTimeLocal("2026-01-01T23:59:59Z"),

    maxRedemptions: 5,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const previewText = useMemo(() => {
    const discount =
      form.type === "fixed"
        ? `৳${Number(form.value || 0)} off`
        : `${Number(form.value || 0)}% off`;

    return `${form.code || "—"} • ${discount} • Min ৳${Number(
      form.minOrderAmount || 0
    )}`;
  }, [form.code, form.type, form.value, form.minOrderAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount),
      startsAt: fromDateTimeLocalToISO(form.startsAtLocal),
      endsAt: fromDateTimeLocalToISO(form.endsAtLocal),
      maxRedemptions: Number(form.maxRedemptions),
      isActive: Boolean(form.isActive),
    };

    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Failed to create voucher");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Network error: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Restaurant Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Voucher
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">Preview:</span>
            <span className="font-medium text-zinc-100">{previewText}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 ">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl shadow-black/20">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Voucher Details</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Fill the fields and submit to create a new voucher.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Code">
                    <input
                      value={form.code}
                      onChange={(e) => update("code", e.target.value)}
                      placeholder="HELLO10"
                      className="input"
                      required
                    />
                  </Field>

                  <Field label="Type">
                    <select
                      value={form.type}
                      onChange={(e) => update("type", e.target.value)}
                      className="input"
                    >
                      <option value="fixed">fixed</option>
                      <option value="percent">percent</option>
                    </select>
                  </Field>
                </div>

                {/* Row 2 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={
                      form.type === "fixed" ? "Value (Amount)" : "Value (%)"
                    }
                  >
                    <input
                      type="number"
                      value={form.value}
                      onChange={(e) => update("value", Number(e.target.value))}
                      className="input"
                      min="0"
                      required
                    />
                  </Field>

                  <Field label="Min Order Amount">
                    <input
                      type="number"
                      value={form.minOrderAmount}
                      onChange={(e) =>
                        update("minOrderAmount", Number(e.target.value))
                      }
                      className="input"
                      min="0"
                      required
                    />
                  </Field>
                </div>

                {/* ✅ Row 3 (DATE PICKERS) */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Starts At">
                    <input
                      type="datetime-local"
                      value={form.startsAtLocal}
                      onChange={(e) => update("startsAtLocal", e.target.value)}
                      className="input"
                      required
                    />
                    <p className="mt-1 text-xs text-zinc-400">
                      Will be sent as ISO UTC (Z) automatically
                    </p>
                  </Field>

                  <Field label="Ends At">
                    <input
                      type="datetime-local"
                      value={form.endsAtLocal}
                      onChange={(e) => update("endsAtLocal", e.target.value)}
                      className="input"
                      required
                    />
                    <p className="mt-1 text-xs text-zinc-400">
                      Will be sent as ISO UTC (Z) automatically
                    </p>
                  </Field>
                </div>

                {/* Row 4 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Max Redemptions">
                    <input
                      type="number"
                      value={form.maxRedemptions}
                      onChange={(e) =>
                        update("maxRedemptions", Number(e.target.value))
                      }
                      className="input"
                      min="1"
                      required
                    />
                  </Field>

                  <div className="flex items-end justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <div>
                      <p className="text-sm font-medium">Voucher Status</p>
                      <p className="text-xs text-zinc-400">
                        Enable/disable this voucher.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => update("isActive", !form.isActive)}
                      className={
                        "relative h-10 w-16 rounded-full border transition " +
                        (form.isActive
                          ? "border-emerald-500/40 bg-emerald-500/20"
                          : "border-zinc-700 bg-zinc-900")
                      }
                      aria-label="Toggle active"
                    >
                      <span
                        className={
                          "absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full transition " +
                          (form.isActive
                            ? "left-8 bg-emerald-400"
                            : "left-1 bg-zinc-400")
                        }
                      />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-zinc-400">
                    Tip: Use unique codes like{" "}
                    <span className="text-zinc-200">WELCOME20</span>.
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setResult(null);
                        setForm({
                          code: "",
                          type: "fixed",
                          value: 0,
                          minOrderAmount: 0,
                          startsAtLocal: "",
                          endsAtLocal: "",
                          maxRedemptions: 1,
                          isActive: true,
                        });
                      }}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-60"
                    >
                      {loading ? "Creating..." : "Create Voucher"}
                    </button>
                  </div>
                </div>
              </form>

              {error ? (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  ❌ {error}
                </div>
              ) : null}

              {result ? (
                <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-sm font-semibold text-emerald-200">
                    ✅ Voucher created successfully!
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .input {
            width: 100%;
            border-radius: 0.9rem;
            border: 1px solid rgb(39 39 42);
            background: rgba(9, 9, 11, 0.55);
            padding: 0.65rem 0.8rem;
            color: rgb(244 244 245);
            outline: none;
            transition: border-color 150ms ease, box-shadow 150ms ease;
          }
          .input:focus {
            border-color: rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.06);
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
