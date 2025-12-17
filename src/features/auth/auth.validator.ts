import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3), //TODO: check username from frontend requirements
  password: z.string().min(6), //TODO: check password from frontend requirements
});

export type LoginSchema = z.infer<typeof loginSchema>;