import {z} from 'zod'

export const superAdminSignUpSchema = z.object({
    email: z.email(),
    password:z.string().min(8),
    username: z.string().min(5),
    contact: z.string(),
    name: z.string(),
    isActive:z.boolean()// default false
})

export type SuperAdminSignUpSchema = z.infer<typeof superAdminSignUpSchema>;