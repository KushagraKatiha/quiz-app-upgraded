import { z } from 'zod';

export const questionSchema = z.object({
    questionText: z.string().min(1, { message: 'Question text is required' }),
    options: z.array(z.string()).length(4, { message: 'There must be exactly 4 options' }),
    correctOption: z.string().min(1).max(1, { message: 'Correct option must be between 0 and 3' }),
    explanation: z.string().min(1, { message: 'Explanation is required' }),
});



