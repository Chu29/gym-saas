const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export const SERVICE_CATEGORIES = [
  'SAUNA',
  'PERSONAL_TRAINING',
  'POOL',
  'GROUP_CLASS',
  'SPA',
  'OTHER',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  tokenCost: number;
  isActive: boolean;
  createdAt: string;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string };

// DEV-ONLY: replace with the logged-in user's session token once real auth exists.
// Only call this from server code (Server Components / Server Actions).
function authHeaders(): Record<string, string> {
  const id = process.env.DEV_ADMIN_USER_ID;
  if (!id) throw new Error('DEV_ADMIN_USER_ID is not set in apps/web/.env.local');
  return { 'x-dev-user-id': id };
}

async function request<T>(
  path: string,
  init?: { method: string; body: string },
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      cache: 'no-store',
    });
  } catch {
    return { ok: false, message: 'Could not reach the API. Is it running?' };
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    return { ok: false, message: message ?? `Request failed (${res.status})` };
  }
  return { ok: true, data: (await res.json()) as T };
}

export function listServices(isActive?: boolean) {
  const query = isActive === undefined ? '' : `?isActive=${isActive}`;
  return request<Service[]>(`/services${query}`);
}

export function createService(input: {
  name: string;
  description?: string;
  category: ServiceCategory;
  tokenCost: number;
}) {
  return request<Service>('/services', { method: 'POST', body: JSON.stringify(input) });
}

export function updateService(
  id: string,
  patch: Partial<{
    name: string;
    description: string;
    category: ServiceCategory;
    tokenCost: number;
    isActive: boolean;
  }>,
) {
  return request<Service>(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
}
