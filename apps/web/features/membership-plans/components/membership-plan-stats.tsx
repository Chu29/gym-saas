// apps/web/features/membership-plans/components/membership-plan-stats.tsx
import { ArrowUp, Award, RotateCw, TrendingUp, Users } from "lucide-react";
import type { MembershipPlan } from "../types";

export function MembershipPlanStats({ plans }: { plans: MembershipPlan[] }) {
  const active = plans.filter((p) => p.isActive);
  const topTier = [...active].sort((a, b) => b.priceCents - a.priceCents)[0];

  const stats = [
    {
      label: "ACTIVE ENROLLMENT",
      value: "94",
      icon: Users,
      trend: "+12.4% vs last month",
      up: true,
    },
    {
      label: "PROJECTED MRR",
      value: "1,425,000 XFA",
      icon: TrendingUp,
      trend: `Across ${active.length || 4} tiers`,
      up: null,
    },
    {
      label: "TOP TIER BY SHARE",
      value: topTier?.name ?? "Monthly Plan",
      icon: Award,
      trend: "44.6% of member base",
      up: null,
    },
    {
      label: "AVERAGE RETENTION",
      value: "7.2 mo",
      icon: RotateCw,
      trend: "+0.8 mo trend",
      up: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {s.label}
              </span>
              <Icon className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{s.value}</p>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                s.up ? "text-emerald-600 font-semibold" : "text-gray-500"
              }`}
            >
              {s.up && <ArrowUp className="h-3 w-3" />}
              {s.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}
