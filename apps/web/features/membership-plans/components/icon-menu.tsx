// apps/web/features/membership-plans/components/icon-menu.tsx
'use client';

import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useClickOutside } from '../lib/use-click-outside';

export function IconMenu({
  items,
}: {
  items: { label: string; onClick: () => void; danger?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 shadow-2xs hover:bg-gray-50 hover:text-gray-700 transition-colors"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-gray-200 bg-white py-1 shadow-lg divide-y divide-gray-100">
          <div className="py-0.5">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className={`block w-full px-3.5 py-1.5 text-left text-xs font-medium transition-colors hover:bg-gray-50 ${
                  item.danger
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
