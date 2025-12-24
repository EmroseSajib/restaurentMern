import { z } from "zod";

export const validateMembershipSchema = z.object({
  membershipId: z.string().trim().min(2).max(80),
  subtotalAmount: z.number().int().min(0), // cents
});
