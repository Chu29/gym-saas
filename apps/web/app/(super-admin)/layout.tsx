import Link from 'next/link';
import type { ReactNode } from 'react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              Platform Admin
            </span>
            <h1 className="text-xl font-bold text-white">GymSaaS Control</h1>
          </div>

          <nav className="space-y-1">
            <Link
              href="/super-admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              📊 Overview
            </Link>
            <Link
              href="/super-admin/tenants"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              🏋️ Tenants (Gyms)
            </Link>
            <Link
              href="/super-admin/plans"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              💳 SaaS Plans
            </Link>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 text-xs text-slate-500">
          Global Super Admin Scope
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
