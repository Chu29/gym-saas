'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icon';

const ITEMS = [
  { href: '/admin', label: 'Overview', icon: 'grid_view' },
  { href: '/front-desk', label: 'Front desk', icon: 'counter_1' },
  { href: '/terminal', label: 'Terminal', icon: 'point_of_sale' },
  { href: '/admin/services', label: 'Services', icon: 'loyalty' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-x-0 top-0 z-50 flex items-center gap-3 overflow-x-auto bg-surface-container-lowest px-4 py-3 shadow-sm lg:inset-y-0 lg:right-auto lg:w-72 lg:flex-col lg:items-stretch lg:justify-start lg:gap-6 lg:overflow-visible lg:py-6">
      <div className="flex shrink-0 flex-col leading-none lg:px-3">
        <span className="text-lg font-semibold">Fitnexa</span>
        <span className="text-[11px] font-bold tracking-wider text-primary">Serene Pulse</span>
      </div>
      <nav aria-label="Admin" className="flex gap-1 lg:flex-col">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Icon name={item.icon} className="text-[20px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
