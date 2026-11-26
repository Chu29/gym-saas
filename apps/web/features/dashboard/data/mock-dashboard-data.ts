import {
  AttendanceEntry,
  DashboardKPIs,
  ExpiringMembership,
  RecentMember,
  RecentPayment,
} from '../types';

export const mockKPIs: DashboardKPIs = {
  totalMembers: { value: 1280, cap: 1500, percentage: 85.3 },
  activeMembers: { value: 1194, percentage: 93.3 },
  newSignups: { value: 42, growthPercent: 18, priorMonth: 35 },
  todayCheckIns: { value: 348, currentlyInside: 64 },
  mrr: { value: 18400, growthPercent: 8.2, target: 17000 },
  expiringSoon: { count: 38, queuedAutoRenew: 38 },
  activeTrainers: { active: 24, onFloor: 18, utilizationPercent: 75 },
};

export const mockRecentMembers: RecentMember[] = [
  {
    id: '1',
    name: 'Marcus Vance Jr.',
    memberCode: '#M2-8949',
    planName: 'Black Card VIP',
    status: 'Active',
    joinedAt: 'Today, 08:14',
  },
  {
    id: '2',
    name: 'Elena Rostova',
    memberCode: '#M2-8950',
    planName: 'Standard Access',
    status: 'Active',
    joinedAt: 'Yesterday',
  },
  {
    id: '3',
    name: 'Liam Gallagher',
    memberCode: '#M2-8951',
    planName: 'Premium Pro',
    status: 'Active',
    joinedAt: 'Oct 30, 2026',
  },
  {
    id: '4',
    name: 'Chloe Bennett',
    memberCode: '#M2-8952',
    planName: 'Off-Peak Special',
    status: 'Pending',
    joinedAt: 'Oct 29, 2026',
  },
];

export const mockRecentPayments: RecentPayment[] = [
  {
    id: '1',
    memberName: 'Marcus Vance Jr.',
    planName: 'All-Access Black Card',
    amount: 150.0,
    method: 'Card •••• 4343',
    status: 'Settled',
  },
  {
    id: '2',
    memberName: 'Elena Rostova',
    planName: 'Standard Monthly Plan',
    amount: 99.0,
    method: 'Stripe ACH',
    status: 'Successful',
  },
  {
    id: '3',
    memberName: 'Liam Gallagher',
    planName: 'Personal Trainer 5-Pack',
    amount: 250.0,
    method: 'Apple Pay',
    status: 'Successful',
  },
  {
    id: '4',
    memberName: 'Chloe Bennett',
    planName: 'Off-Peak Access Fee',
    amount: 65.0,
    method: 'Mobile Money',
    status: 'Settled',
  },
];

export const mockExpiringMemberships: ExpiringMembership[] = [
  {
    id: '1',
    memberName: 'Sarah Jenkins',
    planName: 'Standard Monthly',
    expirationDate: 'Nov 02, 2026',
    daysRemaining: 2,
  },
  {
    id: '2',
    memberName: 'David Rossi',
    planName: 'Black Card VIP',
    expirationDate: 'Nov 04, 2026',
    daysRemaining: 4,
  },
  {
    id: '3',
    memberName: 'Keiko Tanaka',
    planName: 'Premium Pro',
    expirationDate: 'Nov 06, 2026',
    daysRemaining: 6,
  },
  {
    id: '4',
    memberName: 'Mateo Silva',
    planName: 'Off-Peak Special',
    expirationDate: 'Nov 07, 2026',
    daysRemaining: 7,
  },
];

export const mockAttendanceFeed: AttendanceEntry[] = [
  {
    id: '1',
    memberName: 'Alex Rivera',
    checkInTime: '09:42 AM',
    gate: 'Turnstile Gate B',
    status: 'In Facility',
  },
  {
    id: '2',
    memberName: 'Jordan Lee',
    checkInTime: '08:30 AM',
    checkOutTime: '09:35 AM',
    gate: 'Turnstile Gate A',
    status: 'Completed',
    durationMinutes: 65,
  },
  {
    id: '3',
    memberName: 'Sophia Chen',
    checkInTime: '09:15 AM',
    gate: 'Gate VIP-1 (Sauna)',
    status: 'In Facility',
  },
  {
    id: '4',
    memberName: 'Michael Torres',
    checkInTime: '07:45 AM',
    checkOutTime: '09:00 AM',
    gate: 'Turnstile Gate B',
    status: 'Completed',
    durationMinutes: 75,
  },
];
