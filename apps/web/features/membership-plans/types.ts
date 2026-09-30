export type BillingCycle = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "ANNUAL";
export type DurationUnit = "DAY" | "MONTH" | "YEAR";

export interface MembershipPlan {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  priceCents: number;
  durationValue: number;
  durationUnit: DurationUnit;
  billingCycle: BillingCycle;
  perks: string[];
  isActive: boolean;
  createdAt: string;
}
