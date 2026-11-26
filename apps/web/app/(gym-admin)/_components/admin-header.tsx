'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Bell, Building2, HelpCircle, Search } from 'lucide-react';

export function AdminHeader() {
  const { user, isLoaded } = useUser();

  // Read actual gym name from Clerk publicMetadata (or fallback while loading)
  const gymName =
    (user?.publicMetadata?.gymName as string) ||
    (user?.publicMetadata?.tenantName as string) ||
    (isLoaded ? 'My Gym' : 'Loading...');

  const userRole = (user?.publicMetadata?.role as string) || 'Gym Admin';
  const displayName = user?.fullName || user?.firstName || 'Admin';

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: Gym Name Badge & Search */}
      <div className="flex items-center gap-4">
        {/* Gym Name Badge */}
        <div className="inline-flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-800">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold uppercase text-emerald-950">{gymName}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-64 lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full rounded-md border border-gray-200 bg-gray-50/70 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Right: Notifications, Help, User Profile */}
      <div className="flex items-center gap-5">
        {/* Notifications Icon with Badge */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-gray-500 transition-colors hover:text-gray-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* Help Icon */}
        <button
          type="button"
          aria-label="Help and documentation"
          className="text-gray-500 transition-colors hover:text-gray-800"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="h-7 w-px bg-gray-200" />

        {/* User Profile Block */}
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end leading-tight sm:flex">
            <span className="text-sm font-semibold text-gray-900">
              {isLoaded ? displayName : '...'}
            </span>
            <span className="text-xs text-gray-500">{userRole}</span>
          </div>

          {/* Clerk Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-white">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
