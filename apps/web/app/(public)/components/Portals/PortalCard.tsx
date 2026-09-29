import { Badge } from '@repo/ui/components/ui/badge';
import { Progress } from '@repo/ui/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import type { PortalData } from './portals-data';

export function PortalCard({ portal }: { portal: PortalData }) {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column - Details */}
        <div className="lg:col-span-6 space-y-4">
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-[11px] font-semibold tracking-wider text-[#16A34A] uppercase"
          >
            {portal.badge}
          </Badge>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            {portal.title}
          </h3>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{portal.description}</p>

          <div className="space-y-3 pt-2">
            {portal.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Data card */}
        <div className="lg:col-span-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-200/70 pb-3">
              <span className="text-sm font-semibold text-gray-900">{portal.overviewTitle}</span>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200 shadow-2xs">
                {portal.overviewBadge}
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 my-5">
              {portal.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg bg-white p-3 border border-gray-200/80 shadow-2xs"
                >
                  <p className="text-[11px] font-medium text-gray-500 truncate">{metric.label}</p>
                  <p className="mt-1 text-base sm:text-lg font-bold text-gray-950 truncate">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer progress & dispatch */}
            <div className="rounded-lg bg-white p-3.5 border border-gray-200/80">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="text-gray-700">{portal.footerTitle}</span>
                <span className="text-[#16A34A] font-semibold">{portal.footerStatus}</span>
              </div>
              <Progress value={portal.progressValue} className="h-1.5 bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
