import Link from "next/link";

export default async function GiftVoucherSuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful ✅
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Thanks! Your gift voucher payment was completed.
        </p>

        {/* {sessionId ? (
          <div className="mt-4 rounded-xl border bg-gray-50 p-3">
            <p className="text-xs text-muted-foreground">Stripe session</p>
            <p className="mt-1 break-all font-mono text-xs">{sessionId}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-red-600">
            Missing session_id. If you just paid, refresh the page or check the
            URL.
          </p>
        )} */}

        <p className="mt-4 text-sm text-muted-foreground">
          The redeem code will be emailed to the recipient automatically after
          Stripe confirms payment.
        </p>

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
