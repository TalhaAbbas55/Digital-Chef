import * as z from 'zod';

export const ThreadValidation = z.object({
    thread: z.string().min(3,{message:"Please enter at least 3 characters"}).max(1000,{message:"Max 1000 characters are allowed here"}),
    accountId: z.string(),
    
    
});


export const CommentValidation = z.object({
    thread: z.string().min(3,{message:"Please enter at least 3 characters"}).max(1000,{message:"Max 1000 characters are allowed here"}),
});