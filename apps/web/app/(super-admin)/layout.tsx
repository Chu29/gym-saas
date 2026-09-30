import Link from 'next/link';
import type { ReactNode } from 'react';
import '../globals.css';

const navigation = [
  { href: '/super-admin', label: 'Overview' },
  { href: '/super-admin/tenants', label: 'Tenants (Gyms)' },
  { href: '/super-admin/plans', label: 'SaaS Plans' },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 md:flex-row">
      <aside className="flex w-full shrink-0 flex-col justify-between border-b border-neutral-200 bg-gradient-to-b from-emerald-50/70 via-white to-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-green-500 text-sm font-bold text-white shadow-sm shadow-emerald-200">
                F
              </span>
              <span className="text-xl font-bold tracking-tight text-neutral-950">FITNEXA</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-800">
                ADMIN
              </span>
            </div>
            <p className="mt-3 text-xs text-neutral-500">Platform control center</p>
          </div>

          <nav
            aria-label="Super Admin navigation"
            className="flex flex-wrap gap-2 md:flex-col md:gap-1"
          >
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-emerald-50 hover:text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <span className="font-mono text-[10px] text-emerald-600">0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 hidden border-t border-neutral-200 pt-4 md:block">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
              SA
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Super Admin</p>
              <p className="text-[10px] text-neutral-500">Global Control</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-gradient-to-br from-white via-white to-emerald-50/50 p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
