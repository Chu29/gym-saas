const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type RegisterMemberInput = {
  firstName: string;
  lastName: string;
  email: string;
  planId?: string;
};

export async function registerMember(data: RegisterMemberInput, token?: string) {
  const res = await fetch(`${API_BASE}/member-registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = 'Failed to register member';
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? message);
    } catch {
      // response had no JSON body; keep the default message
    }
    throw new Error(message);
  }

  return res.json();
}
