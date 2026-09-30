import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

export interface PricingPlan {
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
}

export function PricingCard({ plan, isAnnual }: PricingCardProps) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl bg-white p-7 transition-all ${
        plan.popular
          ? 'border-2 border-[#16A34A] shadow-xl ring-1 ring-[#16A34A]/20'
          : 'border border-gray-200/90 shadow-xs hover:border-gray-300'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#16A34A] hover:bg-[#15803d] text-white text-[11px] font-bold px-3 py-0.5 tracking-wider uppercase shadow-xs">
            Most Popular
          </Badge>
        </div>
      )}

      <div>
        {/* Tier Title & Description */}
        <h3 className="text-xl font-bold text-gray-950">{plan.name}</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 min-h-[36px]">{plan.tagline}</p>

        {/* Price Display */}
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-950">
            ${price}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {isAnnual ? '/mo (billed annually)' : '/mo (billed monthly)'}
          </span>
        </div>

        {/* Feature List */}
        <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
          {plan.features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700"
            >
              <Check className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" strokeWidth={2.5} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 pt-6">
        <Button
          asChild
          size="lg"
          variant={plan.popular ? 'default' : 'outline'}
          className={`w-full h-11 font-semibold rounded-lg ${
            plan.popular
              ? 'bg-[#16A34A] hover:bg-[#15803d] text-white shadow-md'
              : 'border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-gray-950'
          }`}
        >
          <Link href={plan.ctaHref}>{plan.ctaText}</Link>
        </Button>
      </div>
    </div>
  );
}
