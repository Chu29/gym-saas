import { Headphones, Lock, RefreshCw, ShieldCheck } from 'lucide-react';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: '99.99% Uptime SLA Guaranteed' },
  { icon: Lock, label: '256-bit TLS/SSL Data Encryption' },
  { icon: RefreshCw, label: 'Real-Time Automated Backups' },
  { icon: Headphones, label: 'White-Glove Data Migration Team' },
];

export function PricingTrustBadges() {
  return (
    <div className="mt-12 rounded-xl border border-gray-200/80 bg-white py-4 px-6 shadow-2xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {TRUST_BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600"
            >
              <Icon className="h-4 w-4 text-[#16A34A] shrink-0" />
              <span>{badge.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
