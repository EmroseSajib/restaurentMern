"use client";

import { GiftVoucherPageContent } from "@/components/gift-voucher/gift-voucher-page-content";
import { useSearchParams } from "next/navigation";

export default function GiftVoucherClient() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";

  return (
    <>
      {cancelled && (
        <div className="mx-auto mt-24 max-w-2xl px-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Payment cancelled. You were not charged. You can try again.
          </div>
        </div>
      )}

      <GiftVoucherPageContent />
    </>
  );
}
