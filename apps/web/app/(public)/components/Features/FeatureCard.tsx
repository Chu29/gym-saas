import { Badge } from '@repo/ui/components/ui/badge';
import * as React from 'react';

export interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badgeLabel: string;
  badgeValue: string;
}

export function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-6 shadow-xs hover:border-gray-300 hover:shadow-md transition-all">
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 border border-green-200/60 text-[#16A34A]">
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-5 text-lg font-bold text-gray-950">{feature.title}</h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-500 font-medium">{feature.badgeLabel}</span>
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-800"
        >
          {feature.badgeValue}
        </Badge>
      </div>
    </div>
  );
}
