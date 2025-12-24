import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(2).max(64),
  password: z.string().min(6).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(), // if you want body-based refresh as fallback
});
