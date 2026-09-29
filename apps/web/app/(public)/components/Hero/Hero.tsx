import { DashboardMockup } from './DashboardMockup';
import { HeroActions } from './HeroActions';
import { HeroStats } from './HeroStats';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Title & Value Proposition */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.1]">
            All-in-One Gym Management Platform{' '}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
            Automate member access, streamline recurring billing, build personalized workout
            programs, and scale single clubs or multi-gym franchises with unmatched operational
            precision.
          </p>

          {/* CTAs and Trust Markers */}
          <HeroActions />
        </div>

        {/* Live System Preview Frame */}
        <DashboardMockup />

        {/* Operational Proof Statistics */}
        <HeroStats />
      </div>
    </section>
  );
}
