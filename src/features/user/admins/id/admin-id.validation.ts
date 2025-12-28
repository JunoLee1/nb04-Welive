import {z} from 'zod';
 
const requestParamSchema = z.object({
    id:z.string()
})

type ReqParamSchema = z.infer<typeof requestParamSchema>