import { Activity, Building2, CreditCard, Dumbbell, HeartPulse, QrCode } from 'lucide-react';
import { FeatureCard, type FeatureItem } from './FeatureCard';

const FEATURES: FeatureItem[] = [
  {
    icon: QrCode,
    title: 'Turnstile & Optical QR Access',
    description:
      'Sub-second check-in terminal and passcode security. Apple/Google Wallet NFC passes, optical scanner fallback.',
    badgeLabel: 'Validation Latency',
    badgeValue: '250ms - 340ms',
  },
  {
    icon: CreditCard,
    title: 'Multi-Rail Billing & Revenue Recovery',
    description:
      'Automated recurring dues, Stripe ACH, Credit Card, and Africa/Global Mobile Money (M-Pesa/Orange). Zero failed payments with smart retry logic.',
    badgeLabel: 'Smart Recovery',
    badgeValue: '68.4% Recovered',
  },
  {
    icon: Dumbbell,
    title: 'Periodized Workout & Program Builder',
    description:
      'Coach tools with 3,500+ movements taxonomy, periodized parameters, rest timers, and biometric progression tracking.',
    badgeLabel: 'Taxonomy Library',
    badgeValue: '3,500+ Movements',
  },
  {
    icon: Activity,
    title: 'Real-Time Facility Telemetry',
    description:
      'Live occupancy vs. municipal fire limits, peak-hour heatmaps, equipment wear logs, and staff floor assignments.',
    badgeLabel: 'Capacity Updates',
    badgeValue: 'Sub-Second',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant Franchise Control',
    description:
      'Super-Admin/Supervisor mode, centralized splits, cross-branch memberships, and global analytics.',
    badgeLabel: 'Branch Sync Delay',
    badgeValue: '24.7ms Cloud Ledgers',
  },
  {
    icon: HeartPulse,
    title: 'Member Retention Engine',
    description:
      '24-lock auto-expiring renewals, re-engagement triggers when member visit frequency drops below target thresholds.',
    badgeLabel: 'Re-Engagement Boost',
    badgeValue: '+26% Retention Rate',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="border-b border-gray-100 bg-gray-50/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            Engineered for Real-World Gym Operations
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Replace 5 fragmented tools with a single high-speed system built specifically for
            athletic facilities.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
