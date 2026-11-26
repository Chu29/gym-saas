import { Button } from '@repo/ui/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { ExpiringMembership } from '../types';

export function ExpiringMembershipsCard({ expiring }: { expiring: ExpiringMembership[] }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-bold text-gray-900">Expiring Memberships (Next 7 Days)</h2>
          </div>
          <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
            38 at risk
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-2">Member</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Expiration</th>
                <th className="pb-2">Remaining</th>
                <th className="pb-2 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expiring.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5 font-medium text-gray-900">{m.memberName}</td>
                  <td className="py-2.5 text-gray-500">{m.planName}</td>
                  <td className="py-2.5 text-gray-600">{m.expirationDate}</td>
                  <td className="py-2.5">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {m.daysRemaining} Days
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[10px] border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                    >
                      SMS Reminder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span>Automated renewal sequence: 94.7% success</span>
        <button type="button" className="text-emerald-700 hover:underline font-semibold">
          Batch Renew All (38)
        </button>
      </div>
    </div>
  );
}
