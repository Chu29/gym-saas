import { Badge } from '@repo/ui/components/ui/badge';
import { Activity } from 'lucide-react';

interface ValidationEntry {
  id: string;
  initials: string;
  name: string;
  detail: string;
  gateText: string;
  statusType: 'success' | 'warning';
}

const VALIDATION_ENTRIES: ValidationEntry[] = [
  {
    id: '1',
    initials: 'DR',
    name: 'David Rossi',
    detail: 'Membership: All-Access Black Card',
    gateText: 'Gate 02 (Authorized) • 12 seconds ago',
    statusType: 'success',
  },
  {
    id: '2',
    initials: 'EL',
    name: 'Elena Lindqvist',
    detail: 'Coach Roster: Olympic Lifting Class',
    gateText: 'Gate 01 (Coach NFC) • 43 seconds ago',
    statusType: 'success',
  },
  {
    id: '3',
    initials: 'TO',
    name: 'Tariq Ocampo',
    detail: 'Pass: Guest Metal NFC (Validity: Exp. Today)',
    gateText: 'Gate 04 (Fail Rep) • 1 min ago',
    statusType: 'warning',
  },
];

export function MockupValidationLog() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-2.5">
        <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          Live Turnstile Validation Log
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
          <Activity className="h-3 w-3 text-[#16A34A] animate-pulse" />
          <span>Realtime Telemetry</span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {VALIDATION_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 border border-gray-200">
                {entry.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">{entry.name}</p>
                <p className="text-[11px] text-gray-500">{entry.detail}</p>
              </div>
            </div>
            <div>
              <Badge
                variant="outline"
                className={
                  entry.statusType === 'success'
                    ? 'border-green-200 bg-green-50 text-[11px] font-medium text-[#16A34A]'
                    : 'border-amber-200 bg-amber-50 text-[11px] font-medium text-amber-700'
                }
              >
                {entry.gateText}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
