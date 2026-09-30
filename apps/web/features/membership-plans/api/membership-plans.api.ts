import { apiFetch } from '../../../lib/api-client';
import type { MembershipPlanFormValues } from '../lib/schema';
import type { MembershipPlan } from '../types';

export function getMembershipPlans() {
  return apiFetch<MembershipPlan[]>('/membership-plans');
}

export function createMembershipPlan(data: MembershipPlanFormValues) {
  return apiFetch<MembershipPlan>('/membership-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deactivateMembershipPlan(id: string) {
  return apiFetch<MembershipPlan>(`/membership-plans/${id}`, { method: 'DELETE' });
}
