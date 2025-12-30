import { z } from "zod";

export const requestBodySchema = z.object({
  username: z.string(),
  email: z.email(),
  contact: z.string(),
  password: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
});

export const requestPatchSchema = z.object({
  email: z.email().optional(),
  contact: z.string().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  adminOf: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    officeNumber: z.string().optional(),
  }),
});
export const requestQuerySchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
  searchKeyword: z.string().optional(),
  joinStatus: z.string().default("PENDING"),
});

export const joinStatusSchema = z.object({
  joinStatus: z.string(),
});

export const requestParamSchema = z.object({
  id: z.string(),
});
// ------ infer the schema
export type ReqQuerySchema = z.infer<typeof requestQuerySchema>;

export type BodySchema = z.infer<typeof requestBodySchema>;

export type JoinStatusSchema = z.infer<typeof joinStatusSchema>;

export type ParamSchema = z.infer<typeof requestParamSchema>;

export type  RequestPatchSchema = z.infer<typeof requestPatchSchema>;