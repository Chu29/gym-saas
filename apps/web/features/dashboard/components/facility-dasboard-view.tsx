'use client';

import {
  mockAttendanceFeed,
  mockExpiringMemberships,
  mockKPIs,
  mockRecentMembers,
  mockRecentPayments,
} from '../data/mock-dashboard-data';
import { DashboardHeader } from './dasboard-header';
import { ExpiringMembershipsCard } from './expiring-memberships-card';
import { KPIMetricsGrid } from './kpi-metrics-grid';
import { LiveAttendanceFeed } from './live-attendance-feed';
import { RecentMembersCard } from './recent-members-card';
import { RecentPaymentsCard } from './recent-payments-card';
import { TelemetryCharts } from './telemetry-charts';

export function FacilityDashboardView() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      <KPIMetricsGrid kpis={mockKPIs} />

      <TelemetryCharts />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentMembersCard members={mockRecentMembers} />
        <RecentPaymentsCard payments={mockRecentPayments} />
        <ExpiringMembershipsCard expiring={mockExpiringMemberships} />
        <LiveAttendanceFeed feed={mockAttendanceFeed} />
      </div>
    </div>
  );
}
