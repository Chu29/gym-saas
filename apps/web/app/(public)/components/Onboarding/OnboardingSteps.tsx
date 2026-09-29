import { StepCard, type StepItem } from './StepCard';

const STEPS: StepItem[] = [
  {
    stepNumber: 'STEP 01',
    title: 'Configure Your Facility',
    description:
      'Set membership tiers, operating hours, zone capacities, and staff roles with intuitive granular permission matrices.',
  },
  {
    stepNumber: 'STEP 02',
    title: 'Connect Hardware & Payments',
    description:
      'Plug and play turnstiles, optical QR terminals, and Stripe / Mobile Money rails through our pre-configured webhooks.',
  },
  {
    stepNumber: 'STEP 03',
    title: 'Import Members Zero-Downtime',
    description:
      'Our concierge team handles CSV roster migration, credit token mapping, and automated digital wallet pass dispatch.',
  },
  {
    stepNumber: 'STEP 04',
    title: 'Scale on Autopilot',
    description:
      'Automated WhatsApp and SMS re-engagement schedules, workout library attendance telemetry, run seamlessly 24/7.',
  },
];

export default function OnboardingSteps() {
  return (
    <section className="border-b border-gray-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            Up and Running in 4 Simple Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            From initial sign-up to your first automated check-in in under 48 hours.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <StepCard key={step.stepNumber} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
