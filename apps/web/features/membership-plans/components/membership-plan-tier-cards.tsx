// apps/web/features/membership-plans/components/membership-plan-tier-cards.tsx
import { Pencil, Users } from "lucide-react";
import { formatFCFA } from "../lib/format";
import type { MembershipPlan } from "../types";
import { IconMenu } from "./icon-menu";

const TAGS = ["BASE ACCESS", "VALUE BUNDLE", "COMMITTED TIER", "BEST VALUE"];
const BLURBS = [
  "Standard gym facilities access",
  "Seasonal commit with 1 guest pass",
  "Mid-term pass with bi-monthly fitness review",
  "Annual membership with locker priority",
];

function monthsOf(plan: MembershipPlan) {
  if (plan.durationUnit === "YEAR") return plan.durationValue * 12;
  if (plan.durationUnit === "DAY") return plan.durationValue / 30;
  return plan.durationValue;
}

function savingsFor(plans: MembershipPlan[], plan: MembershipPlan) {
  const monthly = plans.find((p) => p.durationUnit === "MONTH" && p.durationValue === 1);
  if (!monthly || plan.id === monthly.id) return null;
  const equivalentCost = monthly.priceCents * monthsOf(plan);
  const savings = equivalentCost - plan.priceCents;
  return savings > 0 ? savings : null;
}

export function MembershipPlanTierCards({ plans }: { plans: MembershipPlan[] }) {
  const active = plans.filter((p) => p.isActive);
  if (!active.length) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {active.map((plan, i) => {
        const savings = savingsFor(plans, plan);
        const durationSuffix =
          plan.durationUnit === "MONTH"
            ? plan.durationValue > 1
              ? `/${plan.durationValue} Months`
              : "/Month"
            : `/${plan.durationValue} ${plan.durationUnit.toLowerCase()}`;

        return (
          <div
            key={plan.id}
            className="flex min-h-[350px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-md"
          >
            <div>
              {/* Header: Tag & Active status */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  {TAGS[i % TAGS.length]}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Active
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-3.5 text-lg font-bold text-gray-900 tracking-tight">{plan.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2 min-h-[2.5rem]">
                {plan.description || BLURBS[i % BLURBS.length]}
              </p>

              {/* Price & Savings Display */}
              <div className="mt-5 rounded-xl bg-gray-50/70 p-3.5 border border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {formatFCFA(plan.priceCents)}
                  </span>
                  <span className="text-xs font-medium text-gray-500 ml-1">{durationSuffix}</span>
                </div>
                <div className="min-h-[1.25rem] mt-1">
                  {savings ? (
                    <p className="text-xs font-semibold text-emerald-600">
                      Saves {formatFCFA(savings)} vs monthly
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Standard monthly rate</p>
                  )}
                </div>
              </div>

              {/* Active Subscribers metric */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Users className="h-4 w-4 text-gray-400" />
                <span>— active subscribers</span>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="mt-6 flex items-center gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                Edit
              </button>
              <IconMenu
                items={[
                  { label: "View", onClick: () => {} },
                  { label: "Duplicate", onClick: () => {} },
                ]}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
