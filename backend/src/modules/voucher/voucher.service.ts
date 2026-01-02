import { VoucherModel } from "../../models/Voucher.model";
import { ApiError } from "../../utils/apiError";

function nowOk(startsAt: Date | null, endsAt: Date | null) {
  const now = Date.now();
  if (startsAt && startsAt.getTime() > now) return false;
  if (endsAt && endsAt.getTime() < now) return false;
  return true;
}

export async function validateVoucher(input: {
  code: string;
  subtotalAmount: number;
  currency?: string;
}) {
  const code = input.code.toUpperCase();

  const v = await VoucherModel.findOne({ code }).lean();
  if (!v || !v.isActive) throw new ApiError(400, "Voucher not found");

  if (!nowOk(v.startsAt ?? null, v.endsAt ?? null))
    throw new ApiError(400, "Voucher not active");

  if (v.maxRedemptions > 0 && v.redeemedCount >= v.maxRedemptions) {
    throw new ApiError(400, "Voucher limit reached");
  }

  if (input.subtotalAmount < (v.minOrderAmount ?? 0)) {
    throw new ApiError(400, "Order amount too low for this voucher");
  }

  const currency = (input.currency ?? "EUR").toUpperCase();
  if ((v.currency ?? "EUR").toUpperCase() !== currency) {
    throw new ApiError(400, "Voucher currency mismatch");
  }

  let discountAmount = 0;

  if (v.type === "percent") {
    discountAmount = Math.floor((input.subtotalAmount * v.value) / 100);
  } else {
    discountAmount = v.value;
  }

  // never exceed subtotal
  discountAmount = Math.max(0, Math.min(discountAmount, input.subtotalAmount));

  return {
    code: v.code,
    type: v.type,
    value: v.value,
    currency,
    discountAmount,
    minOrderAmount: v.minOrderAmount ?? 0,
  };
}

export async function adminCreateVoucher(input: any) {
  const code = input.code.toUpperCase();
  const exists = await VoucherModel.findOne({ code }).lean();
  if (exists) throw new ApiError(409, "Voucher code already exists");

  const created = await VoucherModel.create({
    ...input,
    code,
    currency: (input.currency ?? "EUR").toUpperCase(),
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
  });

  return { id: String(created._id) };
}
