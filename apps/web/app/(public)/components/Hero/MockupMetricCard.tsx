import { Progress } from '@repo/ui/components/ui/progress';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import * as React from 'react';

export function MockupMetricCard({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between">
      <span className="text-xs font-medium text-gray-500">{title}</span>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-gray-900">{value}</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function OccupancyCard() {
  return (
    <MockupMetricCard title="Facility Live Occupancy" value="348">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Current load</span>
          <span className="font-semibold text-gray-700">74% Cap</span>
        </div>
        <Progress value={74} className="h-1.5 bg-gray-100" />
      </div>
    </MockupMetricCard>
  );
}

export function BillingRunCard() {
  return (
    <MockupMetricCard title="Monthly Billing Run" value="$48,200">
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 font-medium text-[#16A34A]">
          <ArrowUpRight className="h-3 w-3" />
          +14.2%
        </span>
        <span className="text-gray-500">99.1% collected on-time</span>
      </div>
    </MockupMetricCard>
  );
}

export function TurnstileRelayCard() {
  return (
    <MockupMetricCard title="IoT Turnstile Relay" value="Active">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
        <span>4 Lane Optical Gates Synced</span>
      </div>
    </MockupMetricCard>
  );
}

export function ValidationsCard() {
  return (
    <MockupMetricCard title="Pass Validations Today" value="1,429">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-700">
          0.3s Latency
        </span>
        <span>•</span>
        <span>NFC & QR auto-authorized</span>
      </div>
    </MockupMetricCard>
  );
}
