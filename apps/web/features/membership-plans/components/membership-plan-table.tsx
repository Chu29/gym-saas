// apps/web/features/membership-plans/components/membership-plan-table.tsx
"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useDeactivateMembershipPlan } from "../hooks/use-membership-plans";
import { formatBillingCycle, formatFCFA } from "../lib/format";
import type { MembershipPlan } from "../types";
import { IconMenu } from "./icon-menu";

export function MembershipPlanTable({
  plans,
  isLoading,
}: {
  plans: MembershipPlan[];
  isLoading: boolean;
}) {
  const deactivate = useDeactivateMembershipPlan();

  if (isLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-100" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-b border-gray-200 bg-gray-50/75 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Billing Cycle</th>
              <th className="px-4 py-3">Subscribers</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                      {plan.description && (
                        <p className="max-w-xs truncate text-[11px] text-gray-500">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {formatFCFA(plan.priceCents)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-700">
                  {plan.durationValue}{" "}
                  {plan.durationUnit === "MONTH"
                    ? plan.durationValue > 1
                      ? "Months"
                      : "Month"
                    : plan.durationUnit.toLowerCase() + (plan.durationValue > 1 ? "s" : "")}
                </td>
                <td className="px-4 py-3 font-medium text-gray-700">
                  {formatBillingCycle(plan.billingCycle)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 text-center font-semibold text-gray-900">—</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-0 bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                      plan.isActive ? "text-emerald-700" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        plan.isActive ? "bg-emerald-600" : "bg-gray-400"
                      }`}
                    />
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="rounded-md px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Edit
                    </button>
                    <IconMenu
                      items={[
                        {
                          label: "Deactivate",
                          onClick: () => deactivate.mutate(plan.id),
                          danger: true,
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!plans.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  No membership plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {plans.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing 1 to {plans.length} of {plans.length} membership plans
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white shadow-2xs"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-300 disabled:opacity-50"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
