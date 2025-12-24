import { MembershipModel } from "../../models/Membership.model";
import { ApiError } from "../../utils/apiError";

export async function validateMembership(input: {
  membershipId: string;
  subtotalAmount: number;
}) {
  const m = await MembershipModel.findOne({
    membershipId: input.membershipId,
  }).lean();
  if (!m || !m.isActive) throw new ApiError(404, "Membership not found");

  if (m.expiresAt && m.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "Membership expired");
  }

  const percent = m.discountPercent ?? 0;
  const discountAmount = Math.floor((input.subtotalAmount * percent) / 100);

  return {
    membershipId: m.membershipId,
    discountPercent: percent,
    discountAmount,
  };
}
