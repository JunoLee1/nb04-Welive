import {z} from 'zod';
 
export const requestBodySchema = z.object({
    username: z.string(),
    email: z.email(),
    contact:z.string(),
    password:z.string(),
});

export const requestQuerySchema = z.object({
    page: z.number(),
    limit: z.number(),
    searchKeyword: z.string(),
    joinStatus: z.string(),
});

export const joinStatusSchema = z.object({
    joinStatus: z.string(),
});

// ------ infer the schema
export type ReqQuerySchema = z.infer<typeof requestQuerySchema>;

export type BodySchema = z.infer<typeof requestBodySchema>;

export type JoinStatusSchema = z.infer<typeof joinStatusSchema>;