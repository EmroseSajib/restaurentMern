import { Suspense } from "react";
import GiftVoucherClient from "./gift-voucher-client";

export const dynamic = "force-dynamic";

export default function GiftVoucherPage() {
  return (
    <Suspense fallback={null}>
      <GiftVoucherClient />
    </Suspense>
  );
}
