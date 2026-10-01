import type { MembershipPlanFormValues } from '../lib/schema';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function authHeaders(token?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMembershipPlans(token?: string) {
  const res = await fetch(`${API_BASE}/membership-plans`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch plans: ${res.statusText}`);
  }

  return res.json();
}

export async function createMembershipPlan(data: MembershipPlanFormValues, token?: string) {
  const { price, ...rest } = data;
  const payload = { ...rest, priceCents: price };

  const res = await fetch(`${API_BASE}/membership-plans`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create plan: ${res.statusText}`);
  }

  return res.json();
}

export async function deactivateMembershipPlan(id: string, token?: string) {
  const res = await fetch(`${API_BASE}/membership-plans/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to deactivate plan: ${res.statusText}`);
  }

  return res.json();
}
