'use client';

import * as React from 'react';
import { PricingBillingToggle } from './PricingBillingToggle';
import { PricingCard, type PricingPlan } from './PricingCard';
import { PricingTrustBadges } from './PricingTrustBadges';

const PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    tagline: 'For boutique gyms & studios up to 250 members.',
    monthlyPrice: 95,
    annualPrice: 76,
    features: [
      'Up to 250 Active Members',
      '2 Staff/Admin Seats',
      'Optical QR Mobile Check-in',
      'Automated Recurring Billing',
      'Member Self-Service App',
    ],
    ctaText: 'Start Free Trial',
    ctaHref: '/login?plan=starter',
  },
  {
    name: 'Growth / Pro',
    tagline: 'For high-traffic commercial gyms up to 1,500 members.',
    monthlyPrice: 199,
    annualPrice: 159,
    popular: true,
    features: [
      'Up to 1,500 Active Members',
      'Unlimited Staff & Coach Seats',
      'Hardware Turnstile & NFC Relays',
      'Trainer Workout Builder Suite',
      'Live Facility Occupancy Telemetry',
      'Automated SMS & WhatsApp Triggers',
    ],
    ctaText: 'Start Free 14-Day Trial',
    ctaHref: '/login?plan=pro',
  },
  {
    name: 'Enterprise & Multi-Location',
    tagline: 'For gym franchises & multi-branch chains.',
    monthlyPrice: 399,
    annualPrice: 319,
    features: [
      '1,500+ Members (Scaled)',
      'Multi-Branch Hypervisor Portal',
      'Custom API Turnstile Firmware',
      'Dedicated Solution Engineer',
      'Priority 24/7 SLA & Phone Escalation',
      'Full REST API & Webhook Access',
    ],
    ctaText: 'Contact Enterprise Sales',
    ctaHref: '#contact',
  },
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(true);

  return (
    <section id="pricing" className="border-b border-gray-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            Transparent Pricing. Zero Hidden Fees.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Start with a 14-day free trial. Cancel or change plans anytime.
          </p>

          <div className="mt-8">
            <PricingBillingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Trust & Compliance Badges */}
        <PricingTrustBadges />
      </div>
    </section>
  );
}
