import { z } from "zod";
export const passwordSchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
});

export const avatarImageSchema = z.object({
  avatarImage: z.string(),
});
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type AvatarImageSchema = z.infer<typeof avatarImageSchema>;
