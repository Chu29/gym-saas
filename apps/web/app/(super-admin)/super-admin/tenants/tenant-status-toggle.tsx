'use client';

import { useState } from 'react';

interface TenantStatusToggleProps {
  tenantId: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
}

export default function TenantStatusToggle({ tenantId, status }: TenantStatusToggleProps) {
  const [loading, setLoading] = useState(false);

  const isSuspended = status === 'SUSPENDED';

  async function handleToggle() {
    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${apiUrl}/super-admin/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: isSuspended ? 'ACTIVE' : 'SUSPENDED',
        }),
      });

      if (!res.ok) {
        const _error = await res.text();
        return;
      }

      window.location.reload();
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  }

  // Don't allow CANCELLED tenants to be toggled.
  if (status === 'CANCELLED') {
    return <span className="text-xs text-neutral-400">Cancelled</span>;
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        isSuspended
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-rose-600 text-white hover:bg-rose-700'
      }`}
    >
      {loading ? 'Updating...' : isSuspended ? 'Activate' : 'Suspend'}
    </button>
  );
}
