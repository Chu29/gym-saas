import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../../../../../packages/ui/src/components/ui/badge';
import { RecentPayment } from '../types';

export function RecentPaymentsCard({ payments }: { payments: RecentPayment[] }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">Recent Payments & Settlement</h2>
          </div>
          <Link
            href="/admin/billing"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            View Ledger
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-2">Member</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5">
                    <div className="font-medium text-gray-900">{p.memberName}</div>
                    <div className="text-[10px] text-gray-400">{p.planName}</div>
                  </td>
                  <td className="py-2.5 font-bold text-gray-900">{p.amount.toFixed(2)} XFA</td>
                  <td className="py-2.5 text-gray-500">{p.method}</td>
                  <td className="py-2.5">
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold"
                    >
                      ✓ {p.status}
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
          Daily volume: <strong className="text-gray-900"> 564.00 XFA</strong>
        </span>
        <span className="text-emerald-700 font-medium">Gateway Healthy (100%)</span>
      </div>
    </div>
  );
}
