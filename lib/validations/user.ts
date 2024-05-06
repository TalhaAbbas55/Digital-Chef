import * as z from 'zod';

export const UserValidation = z.object({
    profile_photo: z.string().url().min(1),
    name: z.string().min(3,{message:"Please enter at least 3 characters"}).max(30,{message:"Max 30 characters are allowed here"}),
    username: z.string().min(3,{message:"Please enter at least 3 characters"}).max(30,{message:"Max 30 characters are allowed here"}),
    bio: z.string().min(3,{message:"Please enter at least 3 characters"}).max(1000,{message:"Max 1000 characters are allowed here"}),
    
});