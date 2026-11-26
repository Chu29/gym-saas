import { apiFetch } from '../../../lib/api-client';

export type MemberStatus = 'ACTIVE' | 'FROZEN' | 'CANCELLED';

export interface MemberPlan {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  billingCycle: string;
}

export interface MembershipPlanOption extends MemberPlan {
  isActive: boolean;
}

export interface MemberAttendance {
  id: string;
  checkedInAt: string;
  note: string | null;
}

export interface Member {
  id: string;
  tenantId: string;
  membershipNo: string;
  status: MemberStatus;
  joinedAt: string;
  phone: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  membershipStartsAt: string | null;
  membershipEndsAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  plan: MemberPlan | null;
  wallet?: { balance: number } | null;
  attendance?: MemberAttendance[];
}

export interface MemberDetailsUpdate {
  phone?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  notes?: string | null;
  membershipStartsAt?: string | null;
  membershipEndsAt?: string | null;
  planId?: string | null;
}

export function listMembers() {
  return apiFetch<Member[]>('/members');
}

export function getMember(id: string) {
  return apiFetch<Member>(`/members/${id}`);
}

export function listMembershipPlans() {
  return apiFetch<MembershipPlanOption[]>('/membership-plans');
}

export function updateMemberDetails(id: string, details: MemberDetailsUpdate) {
  return apiFetch<Member>(`/members/${id}/details`, {
    method: 'PATCH',
    body: JSON.stringify(details),
  });
}

export function updateMemberStatus(id: string, status: MemberStatus) {
  if (status === 'CANCELLED') {
    return apiFetch<void>(`/members/${id}`, { method: 'DELETE' });
  }
  const action = status === 'FROZEN' ? 'freeze' : 'reactivate';
  return apiFetch<void>(`/members/${id}/${action}`, { method: 'PATCH' });
}

export function recordMemberCheckIn(id: string) {
  return apiFetch<MemberAttendance>(`/members/${id}/check-ins`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}
