"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessClient() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const base =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const res = await fetch(
          `${base}/v1/gift-vouchers/stripe/success?session_id=${encodeURIComponent(sessionId)}`,
        );
        const json = await res.json();
        setData(json?.data ?? null);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [sessionId]);

  const isPaid = data?.status === "paid";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful ✅
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Thanks! Your gift voucher payment was completed.
        </p>

        {!sessionId ? (
          <div className="mt-5 rounded-xl border bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              Missing session_id
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              URL must include ?session_id=...
            </p>
          </div>
        ) : loading ? (
          <div className="mt-5 rounded-xl border bg-yellow-50 p-4">
            <p className="text-sm font-semibold text-yellow-900">
              Loading voucher…
            </p>
          </div>
        ) : isPaid ? (
          <div className="mt-5 rounded-xl border bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">
              Your Redeem Code
            </p>
            <p className="mt-2 text-lg font-bold tracking-widest">
              {data.code}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border bg-yellow-50 p-4">
            <p className="text-sm font-semibold text-yellow-900">
              Payment processing…
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              If you paid with iDEAL, it may take a moment. Refresh this page.
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="flex-1 rounded-xl bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Go Home
          </Link>
          <Link
            href="/gift-voucher"
            className="flex-1 rounded-xl border px-4 py-2 text-center text-sm font-semibold hover:bg-gray-50"
          >
            Buy Another
          </Link>
        </div>
      </div>
    </div>
  );
}
