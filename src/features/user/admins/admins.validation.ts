import {z} from 'zod';
 
const requestQuerySchema = z.object({
    page: z.number(),
    limit: z.number(),
    searchKeyword: z.string(),
    joinStatus: z.string(),
})

export type ReqQuerySchema = z.infer<typeof requestQuerySchema>