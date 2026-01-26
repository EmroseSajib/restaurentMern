import { GiftVoucherModel } from "../../models/GiftVoucher.model";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function validateGiftVoucher(input: {
  code: string;
  subtotalAmount: number;
}) {
  const code = String(input.code || "")
    .trim()
    .toUpperCase();
  if (!code) throw new ApiError(400, "Voucher code required");

  const v = await GiftVoucherModel.findOne({ code }).lean();
  if (!v || !v.isActive) throw new ApiError(400, "Voucher not found");

  // must be paid to be usable
  if (v.paymentStatus !== "paid") throw new ApiError(400, "Voucher not paid");

  // redemption limits
  if (v.maxRedemptions > 0 && v.redemptionsCount >= v.maxRedemptions) {
    throw new ApiError(400, "Voucher limit reached");
  }

  const subtotal = Math.round(Number(input.subtotalAmount || 0));
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    throw new ApiError(400, "Invalid subtotal amount");
  }

  let discountAmount = 0;

  if (v.type === "percent") {
    discountAmount = Math.floor((input.subtotalAmount * v.amount) / 100);
  } else {
    discountAmount = v.amount;
  }

  // never exceed subtotal
  discountAmount = Math.max(0, Math.min(discountAmount, input.subtotalAmount));

  return {
    code: v.code,
    voucherAmount: v.amount,
    type: v.type,
    discountAmount,
    maxRedemptions: v.maxRedemptions,
    redemptionsCount: v.redemptionsCount,
  };
}
