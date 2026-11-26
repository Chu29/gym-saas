import { Badge } from '@repo/ui/components/ui/badge';
import { Radio } from 'lucide-react';
import { AttendanceEntry } from '../types';

export function LiveAttendanceFeed({ feed }: { feed: AttendanceEntry[] }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-700 animate-pulse" />
            <h2 className="text-sm font-bold text-gray-900">Today's Attendance Real-Time Feed</h2>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" /> Live Synced
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-2">Member</th>
                <th className="pb-2">Check-in</th>
                <th className="pb-2">Check-out</th>
                <th className="pb-2">Turnstile</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {feed.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5 font-medium text-gray-900">{a.memberName}</td>
                  <td className="py-2.5 text-gray-600 font-mono text-[11px]">{a.checkInTime}</td>
                  <td className="py-2.5 text-gray-400 font-mono text-[11px]">
                    {a.checkOutTime || '—'}
                  </td>
                  <td className="py-2.5 text-gray-600">{a.gate}</td>
                  <td className="py-2.5 text-right">
                    <Badge
                      variant="outline"
                      className={
                        a.status === 'In Facility'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }
                    >
                      {a.status === 'Completed' ? `Completed (${a.durationMinutes}m)` : a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span>
          Active in facility right now: <strong className="text-gray-900">64 members</strong>
        </span>
        <button type="button" className="text-emerald-700 hover:underline font-medium">
          Full Real-Time Gate Log
        </button>
      </div>
    </div>
  );
}
