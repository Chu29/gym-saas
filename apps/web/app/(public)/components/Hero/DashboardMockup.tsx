import { Lock } from 'lucide-react';
import {
  BillingRunCard,
  OccupancyCard,
  TurnstileRelayCard,
  ValidationsCard,
} from './MockupMetricCard';
import { MockupValidationLog } from './MockupValidationLog';

export function DashboardMockup() {
  return (
    <div className="mx-auto mt-12 w-full max-w-5xl rounded-xl border border-gray-200/90 bg-white p-2 sm:p-4 shadow-xl shadow-gray-200/60 ring-1 ring-gray-900/5">
      {/* Browser Window Header Chrome */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 px-2">
        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>

        {/* Browser URL Bar */}
        <div className="flex items-center gap-2 rounded-md bg-gray-50 border border-gray-200/60 px-3 py-1 text-xs text-gray-500 font-mono">
          <Lock className="h-3 w-3 text-gray-400" />
          <span className="hidden sm:inline">app.FITNEXA.io/facility/command-center</span>
          <span className="sm:hidden">FITNEXA.io/...</span>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-[#16A34A] border border-green-200/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Internal Dashboard View */}
      <div className="space-y-4 bg-gray-50/50 p-3 sm:p-5 rounded-lg border border-gray-100">
        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <OccupancyCard />
          <BillingRunCard />
          <TurnstileRelayCard />
          <ValidationsCard />
        </div>

        {/* Live Turnstile Validation Log */}
        <MockupValidationLog />
      </div>
    </div>
  );
}
