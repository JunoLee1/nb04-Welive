import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(5), 
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type refreshTokenSchema = z.infer<typeof refreshTokenSchema>;
