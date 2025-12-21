import {z} from 'zod';
 
const requestBodySchema = z.object({
    username: z.string(),
    email: z.email(),
    contact:z.string(),
    password:z.string(),
})
const requestQuerySchema = z.object({
    page: z.number(),
    limit: z.number(),
    searchKeyword: z.string(),
    joinStatus: z.string(),
})

export type ReqQuerySchema = z.infer<typeof requestQuerySchema>
export type BodySchema = z.infer<typeof requestBodySchema>