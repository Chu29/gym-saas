// apps/web/features/membership-plans/components/membership-plans-view.tsx
'use client';

import { Download, Plus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMembershipPlans } from '../hooks/use-membership-plans';
import { CreateMembershipPlanDialog } from './create-membership-plan-dialog';
import { MembershipPlanFilters } from './membership-plan-filters';
import { MembershipPlanStats } from './membership-plan-stats';
import { MembershipPlanTable } from './membership-plan-table';
import { MembershipPlanTierCards } from './membership-plan-tier-cards';

export function MembershipPlansView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { data: plans = [], isLoading, error } = useMembershipPlans();

  const filtered = plans.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.isActive) ||
      (statusFilter === 'inactive' && !p.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Top Action Bar (No breadcrumb row) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Membership Plans</h1>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Catalog v2.4
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage the membership packages available at your gym facility.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 text-gray-500" />
            Export Catalog
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load membership plans. Is the API running at{' '}
          {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}?
        </div>
      )}

      {/* Stats Row */}
      <MembershipPlanStats plans={plans} />

      {/* Tier Cards Row (enlarged & longer cards) */}
      <MembershipPlanTierCards plans={plans} />

      {/* Search & Filters */}
      <MembershipPlanFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={{
          all: plans.length,
          active: plans.filter((p) => p.isActive).length,
          inactive: plans.filter((p) => !p.isActive).length,
        }}
      />

      {/* Data Table */}
      <MembershipPlanTable plans={filtered} isLoading={isLoading} />

      {/* Bottom Engine Banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
          <RefreshCw className="h-4 w-4 shrink-0 text-gray-400" />
          <p>
            <span className="font-semibold text-gray-900">
              Tier Synchronization & Billing Engine
            </span>{' '}
            — Plans are linked to the automated billing control. Updates take effect at 00:00 UTC.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          View Audit History →
        </button>
      </div>

      {/* Modal Dialog */}
      <CreateMembershipPlanDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
