import {z} from 'zod'

export const signUpSchema = z.object({
    email: z.string().email('Invalid Email'),
    password: z.string().min(6, 'Password must be atleast 6 characters long').max(32, 'Password cannot be more than 32 characters long'),
})