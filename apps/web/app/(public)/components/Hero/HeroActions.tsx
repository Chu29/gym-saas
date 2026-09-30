import { Button } from '@repo/ui/components/ui/button';
import { ArrowRight, Calendar, Check } from 'lucide-react';
import Link from 'next/link';

const TRUST_POINTS = [
  'No credit card required',
  '15-minute white-glove migration',
  '99.4% Turnstile Uptime SLA',
];

export function HeroActions() {
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      {/* Primary and Secondary CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto h-12 px-6 rounded-lg bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
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
          className="w-full sm:w-auto h-12 px-6 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium text-base shadow-xs"
        >
          <Link href="#contact">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            Schedule Live Demo
          </Link>
        </Button>
      </div>

      {/* Trust bullet indicators */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600">
        {TRUST_POINTS.map((point) => (
          <div key={point} className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[#16A34A] shrink-0" strokeWidth={2.5} />
            <span>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
