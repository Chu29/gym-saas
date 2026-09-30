import { z } from "zod";

export const membershipPlanFormSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  description: z.string().max(300).optional(),
  price: z.coerce.number().int().min(0, "Price cannot be negative"),
  durationValue: z.coerce.number().int().min(1),
  durationUnit: z.enum(["DAY", "MONTH", "YEAR"]),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "ANNUAL"]),
  isActive: z.boolean().default(true),
  perks: z.array(z.string()).default([]),
});

export type MembershipPlanFormValues = z.infer<typeof membershipPlanFormSchema>;
