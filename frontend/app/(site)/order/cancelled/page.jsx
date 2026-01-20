export default function CancelledPage({ searchParams }) {
  const orderNumber = searchParams?.orderNumber || "";
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-xl border p-6">
        <h1 className="text-2xl font-bold">Payment Cancelled ❌</h1>
        {orderNumber ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Order: <span className="font-semibold">{orderNumber}</span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted-foreground">
          You can try again from checkout.
        </p>
      </div>
    </div>
  );
}
