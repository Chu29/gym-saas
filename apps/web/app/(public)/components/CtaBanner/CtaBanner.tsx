import { Button } from '@repo/ui/components/ui/button';
import { ArrowRight, Calendar, Mail, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0f6b32] px-6 py-14 sm:px-12 sm:py-16 lg:px-16 text-center text-white shadow-xl">
          {/* Subtle background radial glow */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#16A34A]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#22c55e]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Ready to Transform Your Gym Operations?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed">
              Join over 480+ fitness facilities delivering frictionless check-ins and automated
              recurring revenue today.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white text-[#0f6b32] hover:bg-gray-100 font-bold text-base shadow-md transition-all"
              >
                <Link href="#pricing">
                  Start Free 14-Day Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-7 rounded-xl border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold text-base transition-all"
              >
                <Link href="#contact">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule a 1-on-1 Demo
                </Link>
              </Button>
            </div>

            {/* Contact Micro-copy */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/80">
              <span>Questions? Talk to an onboarding specialist:</span>
              <a
                href="mailto:sales@FITNEXA.com"
                className="inline-flex items-center gap-1 font-medium text-white hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                sales@FITNEXA.com
              </a>
              <span>or</span>
              <a
                href="tel:18005553569"
                className="inline-flex items-center gap-1 font-medium text-white hover:underline"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                +1 (800) 555-FLOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
