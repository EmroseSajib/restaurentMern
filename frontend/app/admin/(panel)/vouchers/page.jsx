import Link from "next/link";

import VouchersTable from "./VouchersTable";
import { getVouchers } from "./action";

export default async function VouchersPage() {
  const vouchers = await getVouchers();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vouchers</h1>

        <Link
          href="/admin/vouchers/create-voucher"
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          + Create Voucher
        </Link>
      </div>

      {/* Table */}
      <VouchersTable vouchers={vouchers} />
    </div>
  );
}
