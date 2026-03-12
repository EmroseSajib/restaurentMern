"use client";

import Link from "next/link";

export default function VouchersTable({ vouchers }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Code</th>
            <th className="p-3">Type</th>
            <th className="p-3">Value</th>
            <th className="p-3">Valid</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vouchers.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="p-3 font-medium">{v.code}</td>

              <td className="p-3 capitalize">{v.type}</td>

              <td className="p-3">
                {v.type === "percent"
                  ? `${v.value}%`
                  : `${v.value} ${v.currency}`}
              </td>

              <td className="p-3 text-sm">
                {new Date(v.startsAt).toLocaleDateString()} –{" "}
                {new Date(v.endsAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                {v.isActive ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </td>

              <td className="p-3 text-right space-x-2">
                <Link
                  href={`/admin/vouchers/${v._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Details
                </Link>

                <Link
                  href={`/admin/vouchers/${v._id}/edit`}
                  className="text-amber-600 hover:underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(v._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {vouchers.length === 0 && (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-500">
                No vouchers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* DELETE handler (example) */
async function handleDelete(id) {
  if (!confirm("Are you sure you want to delete this voucher?")) return;

  try {
    const res = await fetch(`/admin/api/vouchers/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    location.reload();
  } catch (err) {
    alert("Failed to delete voucher");
  }
}
