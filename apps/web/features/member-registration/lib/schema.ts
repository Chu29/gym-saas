import { z } from 'zod';

export const registerMemberSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Enter a valid email'),
  planId: z.string().optional(),
});

export type RegisterMemberValues = z.infer<typeof registerMemberSchema>;
