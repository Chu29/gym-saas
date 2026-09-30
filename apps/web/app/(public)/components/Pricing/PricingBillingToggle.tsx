'use client';

import { Badge } from '@repo/ui/components/ui/badge';

interface PricingBillingToggleProps {
  isAnnual: boolean;
  onToggle: (annual: boolean) => void;
}

export function PricingBillingToggle({ isAnnual, onToggle }: PricingBillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="inline-flex items-center rounded-full bg-gray-100 p-1 border border-gray-200">
        <button
          type="button"
          onClick={() => onToggle(false)}
          className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
            !isAnnual ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onToggle(true)}
          className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            isAnnual ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Annual</span>
          <Badge
            variant="outline"
            className="border-green-300 bg-green-50 text-[10px] font-bold text-[#16A34A] px-1.5 py-0"
          >
            Save 20% + 2 Mo Free
          </Badge>
        </button>
      </div>
    </div>
  );
}
