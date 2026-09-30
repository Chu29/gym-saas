import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In to Your Gym</h1>
          <p className="mt-2 text-gray-600">Access your gym management dashboard</p>
        </div>
        <SignIn fallbackRedirectUrl="/onboarding" />
      </div>
    </div>
  );
}
