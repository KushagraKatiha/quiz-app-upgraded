import {z} from 'zod'

export const questionSchema = z.object({
    question: z.string().min(3, 'Question must be atleast 3 characters long').max(100, 'Question cannot be more than 100 characters long'),
    option1: z.string().min(3, 'Option must be atleast 3 characters long').max(20, 'Option cannot be more than 20 characters long'),
    option2: z.string().min(3, 'Option must be atleast 3 characters long').max(20, 'Option cannot be more than 20 characters long'),
    option3: z.string().min(3, 'Option must be atleast 3 characters long').max(20, 'Option cannot be more than 20 characters long'),
    option4: z.string().min(3, 'Option must be atleast 3 characters long').max(20, 'Option cannot be more than 20 characters long'),
    answer: z.string().min(3, 'Answer must be atleast 3 characters long').max(20, 'Answer cannot be more than 20 characters long'),
    explanation: z.string().min(3, 'Explanation must be atleast 3 characters long').max(200, 'Explanation cannot be more than 200 characters long'),
})