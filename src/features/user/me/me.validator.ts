import { z } from "zod";
export const passwordSchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
});

export const avatarImageSchema = z.object({
  avatarImage: z
    .string()
    .regex(/^[A-Za-z0-9+/]+=*$/, {
      message: "Invalid base64 format",
    })
    .max(4194304, {
      message: "Image size too large. Maximum ~3MB encoded",
    }), // base64 string for ~3MB binary
});
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type AvatarImageSchema = z.infer<typeof avatarImageSchema>;
