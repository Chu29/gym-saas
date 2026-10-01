import type { BillingCycle } from '../types';

export function formatFCFA(amount: number) {
  return `F${amount.toLocaleString('en-US')}`;
}

export function formatBillingCycle(cycle: BillingCycle) {
  const map: Record<BillingCycle, string> = {
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly',
    HALF_YEARLY: 'Half-Yearly',
    ANNUAL: 'Yearly',
  };
  return map[cycle];
}
