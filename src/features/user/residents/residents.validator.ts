import { z } from "zod";

export const residentCreateSchema = z.object({
  email: z.email(),
  password: z.string(),
  avatar: z.string().optional(),
  username: z.string(),
  name: z.string(),
  contact: z.string(),
  resident: z.object({
    apartmentId: z.string(),
    building: z.number().int(),
    unit: z.number().int(),
  }),
});

export const reqParamQuerySchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
  unit: z.coerce.number(),
  building: z.coerce.number(),
  searchKeyword: z.string(),
  joinStatus: z.string(),
});

export type ResidentCreateSchema = z.infer<typeof residentCreateSchema>;
export type ReqParamQuerySchema = z.infer<typeof reqParamQuerySchema>;
