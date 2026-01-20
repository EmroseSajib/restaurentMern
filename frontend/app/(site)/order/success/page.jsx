export default async function OrderSuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return <div className="p-6">Missing session_id</div>;
  }

  const API = process.env.API_BASE_URL || "http://localhost:4000";
  const res = await fetch(`${API}/v1/payments/stripe/session/${sessionId}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    return <div className="p-6">Failed to verify payment</div>;
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-xl border p-6">
        <h1 className="text-2xl font-bold">Payment Successful ✅</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order: <span className="font-semibold">{data.data.orderNumber}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Payment:{" "}
          <span className="font-semibold">{data.data.paymentStatus}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Status: <span className="font-semibold">{data.data.orderStatus}</span>
        </p>
      </div>
    </div>
  );
}
