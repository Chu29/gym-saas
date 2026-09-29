import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Gym Account</h1>
          <p className="mt-2 text-gray-600">Sign up to get started with your gym</p>
        </div>
        <SignUp afterSignUpUrl="/onboarding" />
      </div>
    </div>
  );
}
