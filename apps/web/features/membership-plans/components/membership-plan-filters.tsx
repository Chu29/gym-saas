// apps/web/features/membership-plans/components/membership-plan-filters.tsx
"use client";

import { ArrowUpDown, Calendar, Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (v: "all" | "active" | "inactive") => void;
  counts: { all: number; active: number; inactive: number };
}

export function MembershipPlanFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}: Props) {
  const tabs: { key: typeof statusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "inactive", label: "Inactive", count: counts.inactive },
  ];

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search plans..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder:text-gray-400 shadow-2xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
        />
      </div>

      {/* Tabs & Dropdowns */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Plain text tabs */}
        <div className="flex items-center gap-4 text-xs font-medium">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusFilterChange(tab.key)}
                className={`transition-colors ${
                  isActive ? "font-bold text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Selects */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Billing Cycle filter */}
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <select
              defaultValue="all"
              className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-gray-700 shadow-2xs outline-none focus:border-emerald-600 transition-colors"
            >
              <option value="all">All Billing Cycles</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half_yearly">Half-Yearly</option>
              <option value="annual">Annual</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              ▼
            </span>
          </div>

          {/* Sort order select */}
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <select
              defaultValue="subscribers_desc"
              className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-gray-700 shadow-2xs outline-none focus:border-emerald-600 transition-colors"
            >
              <option value="subscribers_desc">Sort by: Subscribers (High to Low)</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
              <option value="name_asc">Sort by: Name (A to Z)</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              ▼
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
