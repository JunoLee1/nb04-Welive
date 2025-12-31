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


// TODO: refactor  seperate the query param
export const reqParamQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  unit: z.coerce.number().optional(),
  building: z.coerce.number().optional(),
  searchKeyword: z.string().optional(),
  joinStatus: z.string().optional(),
});

export const joinStatusSchema = z.object({
  joinStatus: z.string(),
});

export const paramSchema = z.object({
  id: z.string(),
});

export type ResidentCreateSchema = z.infer<typeof residentCreateSchema>;
export type ReqParamQuerySchema = z.infer<typeof reqParamQuerySchema>;
export type JoinStatusSchema = z.infer<typeof joinStatusSchema>;
export type ParamSchema = z.infer<typeof paramSchema>;
