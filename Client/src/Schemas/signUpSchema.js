import {z} from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(3, 'Name must be atleast 3 characters long').max(20, 'Name cannot be more than 20 characters long'),
    email: z.string().email('Invalid Email'),
    type: z.string(),
    password: z.string().min(6, 'Password must be atleast 6 characters long').max(32, 'Password cannot be more than 32 characters long'),
})