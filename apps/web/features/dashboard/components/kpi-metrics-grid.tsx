import { DashboardKPIs } from '../types';

export function KPIMetricsGrid({ kpis }: { kpis: DashboardKPIs }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {/* 1. Total Members */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Total Members</span>
          <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
            Cap: {kpis.totalMembers.cap.toLocaleString()}
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.totalMembers.value.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${kpis.totalMembers.percentage}%` }}
            />
          </div>
          <span className="font-semibold text-emerald-700">{kpis.totalMembers.percentage}%</span>
        </div>
      </div>

      {/* 2. Active Members */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Active</span>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            {kpis.activeMembers.percentage}%
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.activeMembers.value.toLocaleString()}
        </div>
        <div className="text-[11px] text-gray-500">
          <span className="text-emerald-600 font-medium">●</span> Active last 30d
        </div>
      </div>

      {/* 3. New Signups */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>New MTD</span>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            +{kpis.newSignups.growthPercent}%
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.newSignups.value}
        </div>
        <div className="text-[11px] text-gray-500">vs {kpis.newSignups.priorMonth} prior mo</div>
      </div>

      {/* 4. Today Check-ins */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Today Check-ins</span>
          <span className="rounded bg-emerald-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
            {kpis.todayCheckIns.currentlyInside} inside
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.todayCheckIns.value}
        </div>
        <div className="text-[11px] text-gray-500 truncate">Turnstile ingress active</div>
      </div>

      {/* 5. Monthly MRR */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Month MRR</span>
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            +{kpis.mrr.growthPercent}%
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.mrr.value.toLocaleString()} XFA
        </div>
        <div className="text-[11px] text-gray-500 truncate">
          Target: {kpis.mrr.target.toLocaleString()} XFA
        </div>
      </div>

      {/* 6. Expiring (7 Days) */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Expiring 7d</span>
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
            {kpis.expiringSoon.queuedAutoRenew} Queued
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.expiringSoon.count}
        </div>
        <div className="text-[11px] text-gray-500 truncate">Auto-renew active</div>
      </div>

      {/* 7. Active Trainers */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Trainers</span>
          <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
            {kpis.activeTrainers.onFloor} On-Floor
          </span>
        </div>
        <div className="my-2 text-2xl font-bold tracking-tight text-gray-900">
          {kpis.activeTrainers.active}
        </div>
        <div className="text-[11px] text-gray-500 truncate">
          {kpis.activeTrainers.utilizationPercent}% floor util.
        </div>
      </div>
    </div>
  );
}
