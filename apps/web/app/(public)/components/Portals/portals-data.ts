export interface PortalData {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  features: string[];
  overviewTitle: string;
  overviewBadge: string;
  metrics: {
    label: string;
    value: string;
    sub?: string;
  }[];
  footerTitle: string;
  footerStatus: string;
  progressValue: number;
}

export const PORTALS: PortalData[] = [
  {
    id: 'manager',
    tabLabel: 'Gym Manager Command',
    badge: 'EXECUTIVE CONSOLE',
    title: '360° Facility Governance & Multi-Rail Revenue',
    description:
      'Centralized dashboard tracking gross membership recurring billing, failed auto-retry recoveries, locker attrition, and staff performance metrics without spreadsheet fragmentation.',
    features: [
      'Smart dunning engine automatically recovers 68% of failed charges.',
      'Instant multi-currency checkout: Stripe, ACH, and Mobile Money.',
      'Audited PCI-DSS Level 1 compliance with zero stored raw card data.',
    ],
    overviewTitle: 'Financial Health Overview',
    overviewBadge: 'Current Billing Cycle',
    metrics: [
      { label: 'Gross Dues', value: '$124,560' },
      { label: 'Recovered Dunning', value: '+$8,420' },
      { label: 'Churn Rate', value: '0.8%' },
    ],
    footerTitle: 'Stripe & M-Pesa Realtime Revenue Dispatch',
    footerStatus: 'Synced: 100%',
    progressValue: 100,
  },
  {
    id: 'access',
    tabLabel: 'Turnstile & QR Access',
    badge: 'HARDWARE GATEWAY',
    title: 'Sub-Second Optical Gate & Mobile NFC Validation',
    description:
      'High-throughput access telemetry for optical turnstiles, biometric scanners, and Apple Wallet passes with offline failover protection.',
    features: [
      'Offline-first sync buffer prevents peak hour entrance bottlenecks.',
      'Instant anti-passback and duplicate scan prevention protocols.',
      'Native integrations with Dormakaba, Gunnebo, and Kisi hardware relays.',
    ],
    overviewTitle: 'Hardware Telemetry Overview',
    overviewBadge: 'Active Relays',
    metrics: [
      { label: 'Active Lanes', value: '4 / 4 Online' },
      { label: 'Avg Validation', value: '180ms' },
      { label: 'Hardware SLA', value: '99.99%' },
    ],
    footerTitle: 'Optical Gate Relay Daemon & Local Node Sync',
    footerStatus: 'Online: 100%',
    progressValue: 100,
  },
  {
    id: 'trainer',
    tabLabel: 'Trainer & Programming Suite',
    badge: 'COACH OPERATING SYSTEM',
    title: 'Periodized Workout & Athlete Progression Engine',
    description:
      '3,500+ movement taxonomy with set-by-set progression templates, biometric tracking, and group class attendance rosters.',
    features: [
      'Automated workout delivery to athlete app at 5:00 AM daily.',
      'Biometric InBody and Withings scale sync for body composition.',
      'Trainer commission calculation based on verified session check-ins.',
    ],
    overviewTitle: 'Coaching Performance',
    overviewBadge: 'Current Cycle',
    metrics: [
      { label: 'Active Programs', value: '48 Templates' },
      { label: 'Athlete Adherence', value: '84.2%' },
      { label: 'Coach Rating', value: '4.9 / 5' },
    ],
    footerTitle: 'Movement Video & Exercise Taxonomy Sync',
    footerStatus: 'Updated: 100%',
    progressValue: 100,
  },
  {
    id: 'member',
    tabLabel: 'Member Self-Service App',
    badge: 'MEMBER EXPERIENCE',
    title: 'Zero-Friction Pass, Class Booking & Digital Wallet',
    description:
      'White-labeled iOS and Android companion app for instant QR pass display, class RSVP, and self-service membership upgrades.',
    features: [
      'One-tap Apple & Google Wallet pass provisioning.',
      'Self-service billing method updates and invoice downloads.',
      'Automated waitlist notifications via push and WhatsApp.',
    ],
    overviewTitle: 'Member Engagement Overview',
    overviewBadge: 'Live Adoption',
    metrics: [
      { label: 'App Adoption', value: '94.6%' },
      { label: 'Mobile Passes', value: '1,840 Active' },
      { label: 'Check-in Rate', value: '98.2%' },
    ],
    footerTitle: 'Apple & Google Wallet Push Pass Service',
    footerStatus: 'Active: 100%',
    progressValue: 100,
  },
];
