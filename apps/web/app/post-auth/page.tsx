import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type UserMetadata = { role?: string; tenantId?: string };
type AcceptResult = { ok: true } | { ok: false; status: number; message: string };

async function acceptInvitation(token: string | null): Promise<AcceptResult> {
  if (!token)
    return { ok: false, status: 401, message: 'Your session has expired. Sign in again.' };
  try {
    const res = await fetch(`${API_BASE}/member-registrations/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (res.ok) return { ok: true };

    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    return { ok: false, status: res.status, message: message ?? 'Something went wrong.' };
  } catch (_err) {
    return { ok: false, status: 0, message: "We couldn't reach the server. Try again." };
  }
}

export default async function PostAuthPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect('/login');

  // Read metadata from the Clerk user, not the session token: right after sign-up
  // the token can be missing it (or the token was never customized).
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as UserMetadata;

  // Gym staff
  if (meta.role !== 'MEMBER' && meta.tenantId) redirect('/admin');

  // Invited member (or someone with a pending invite on their email)
  const result = await acceptInvitation(await getToken());
  if (result.ok) redirect('/member');

  // No invitation and not a member: a new gym owner
  if (result.status === 404 && meta.role !== 'MEMBER') redirect('/onboarding');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-xl font-bold text-gray-900">
          We couldn&apos;t finish setting up your membership
        </h1>
        <p className="mt-2 text-sm text-gray-600">{result.message}</p>
        <Link
          href="/post-auth"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
