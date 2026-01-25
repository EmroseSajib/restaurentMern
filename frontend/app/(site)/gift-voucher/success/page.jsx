import Link from "next/link";

async function fetchVoucher(sessionId) {
  const base = process.env.API_BASE_URL;
  if (!base) return { status: "pending" };

  const res = await fetch(
    `${base}/v1/gift-vouchers/stripe/success?session_id=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" },
  );

  if (!res.ok) return { status: "pending" };
  const json = await res.json();
  return json?.data ?? { status: "pending" };
}

export default async function GiftVoucherSuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id || null;

  // NOTE: server component logs go to terminal, not browser
  console.log("session_id:", sessionId);

  const data = sessionId ? await fetchVoucher(sessionId) : null;
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

        {sessionId ? (
          isPaid ? (
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
                Refresh this page in a moment to see your redeem code.
              </p>
            </div>
          )
        ) : (
          <div className="mt-5 rounded-xl border bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              Missing session_id
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This page must be opened from Stripe redirect after payment.
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
