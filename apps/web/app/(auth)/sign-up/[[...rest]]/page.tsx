import { SignOutButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignUpForm } from './sign-up-form';

type SignUpSearchParams = {
  plan?: string;
  __clerk_ticket?: string;
  __clerk_status?: string;
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<SignUpSearchParams>;
}) {
  const params = await searchParams;
  const plan = params.plan || 'starter';
  const ticket = params.__clerk_ticket;
  const status = params.__clerk_status; // "sign_up" | "sign_in" | "complete"
  const isInvite = Boolean(ticket);

  const { userId } = await auth();

  // Invite opened in a browser where someone is still signed in
  if (isInvite && userId) {
    const inviteUrl = `/sign-up?${new URLSearchParams({
      __clerk_ticket: ticket ?? '',
      ...(status ? { __clerk_status: status } : {}),
    }).toString()}`;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-gray-900">You&apos;re already signed in</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign out first to accept this invitation with the invited email address.
          </p>
          <SignOutButton redirectUrl={inviteUrl}>
            <button
              type="button"
              className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Sign out and accept invitation
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  // Normal sign-up, already signed in
  if (!isInvite && userId) redirect('/post-auth');

  // Invitation already used
  if (isInvite && status === 'complete') redirect('/post-auth');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isInvite ? 'Accept Your Invitation' : 'Create Your Gym Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isInvite
              ? status === 'sign_in'
                ? 'You already have an account. Sign in to join your gym'
                : 'Set a password to join your gym'
              : 'Sign up to get started with your gym'}
          </p>
        </div>

        <div className="flex justify-center">
          <Suspense fallback={<div className="text-sm text-gray-500">Loading form...</div>}>
            <SignUpForm isInvite={isInvite} status={status} plan={plan} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
