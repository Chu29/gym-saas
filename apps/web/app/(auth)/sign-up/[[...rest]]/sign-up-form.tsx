'use client';

import { SignIn, SignUp } from '@clerk/nextjs';

export function SignUpForm({
  isInvite,
  status,
  plan,
}: {
  isInvite: boolean;
  status?: string;
  plan: string;
}) {
  if (isInvite && status === 'sign_in') {
    return <SignIn forceRedirectUrl="/post-auth" />;
  }

  return (
    <SignUp
      forceRedirectUrl={isInvite ? '/post-auth' : `/onboarding?plan=${plan}`}
      signInForceRedirectUrl="/post-auth"
    />
  );
}
