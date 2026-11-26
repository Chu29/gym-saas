export interface DashboardKPIs {
  totalMembers: { value: number; cap: number; percentage: number };
  activeMembers: { value: number; percentage: number };
  newSignups: { value: number; growthPercent: number; priorMonth: number };
  todayCheckIns: { value: number; currentlyInside: number };
  mrr: { value: number; growthPercent: number; target: number };
  expiringSoon: { count: number; queuedAutoRenew: number };
  activeTrainers: { active: number; onFloor: number; utilizationPercent: number };
}

export interface RecentMember {
  id: string;
  name: string;
  avatarUrl?: string;
  memberCode: string;
  planName: string;
  status: 'Active' | 'Pending' | 'Expired';
  joinedAt: string;
}

export interface RecentPayment {
  id: string;
  memberName: string;
  planName: string;
  amount: number;
  method: string;
  status: 'Settled' | 'Successful' | 'Pending' | 'Failed';
}

export interface ExpiringMembership {
  id: string;
  memberName: string;
  planName: string;
  expirationDate: string;
  daysRemaining: number;
}

export interface AttendanceEntry {
  id: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  gate: string;
  status: 'In Facility' | 'Completed';
  durationMinutes?: number;
}
