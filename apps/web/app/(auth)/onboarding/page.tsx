import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import OnboardingForm from './components/OnboardingForm';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  const { plan = 'starter' } = (await searchParams) ?? {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Gym Setup</h1>
          <p className="mt-2 text-gray-600">
            Tell us about your gym to get started with the {plan} plan
          </p>
        </div>
        <OnboardingForm plan={plan} />
      </div>
    </div>
  );
}
