import {z} from 'zod'

export const superAdminSignUpSchema = z.object({
    email: z.email(),
    password:z.string(),//TODO: use regex for mix character and number
    username: z.string(),// TODO: check regulation for username from front, User Identification 
    contact: z.string(),//TODO: contain "-" 
    name: z.string(),
    isActive:z.boolean()// default false
})

export type SuperAdminSignUpSchema = z.infer<typeof superAdminSignUpSchema>;