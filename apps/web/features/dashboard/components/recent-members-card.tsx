import { Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../../../../../packages/ui/src/components/ui/badge';
import { RecentMember } from '../types';

export function RecentMembersCard({ members }: { members: RecentMember[] }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">Recent Members</h2>
          </div>
          <Link
            href="/admin/members"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            View All 1,280 Members
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-2">Member</th>
                <th className="pb-2">Member ID</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5 font-medium text-gray-900">{m.name}</td>
                  <td className="py-2.5 text-gray-500 font-mono text-[11px]">{m.memberCode}</td>
                  <td className="py-2.5 text-gray-600">{m.planName}</td>
                  <td className="py-2.5">
                    <Badge
                      variant="outline"
                      className={
                        m.status === 'Active'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-gray-400">{m.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span>Showing 4 newly enrolled members</span>
        <button type="button" className="text-emerald-700 hover:underline font-medium">
          Download CSV
        </button>
      </div>
    </div>
  );
}
