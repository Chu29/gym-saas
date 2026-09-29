interface Tenant {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  saasPlan?: { name: string };
  _count?: { members: number };
}

const STATUS_STYLES: Record<Tenant['status'], { badge: string; dot: string }> = {
  ACTIVE: { badge: 'bg-emerald-50 text-emerald-800', dot: 'bg-emerald-600' },
  TRIAL: { badge: 'bg-sky-50 text-sky-800', dot: 'bg-sky-500' },
  SUSPENDED: { badge: 'bg-rose-50 text-rose-800', dot: 'bg-rose-500' },
  CANCELLED: {
    badge: 'bg-neutral-100 text-neutral-600',
    dot: 'bg-neutral-400',
  },
};

async function getTenants(): Promise<Tenant[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/super-admin/tenants`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log fetch errors on server
    console.error('Failed to fetch tenants from API:', error);
    return [];
  }
}

export default async function TenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          Platform management
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">Registered gyms</h1>
        <p className="mt-2 text-sm text-neutral-600">
          View and manage tenant status and subscriptions.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm shadow-neutral-200/50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-emerald-50/70 text-xs uppercase tracking-wide text-neutral-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Gym name / slug</th>
                <th className="px-6 py-4 font-semibold">Owner email</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {tenants.map((tenant) => {
                const style = STATUS_STYLES[tenant.status] ?? STATUS_STYLES.TRIAL;
                return (
                  <tr key={tenant.id} className="transition-colors hover:bg-emerald-50/40">
                    <td className="px-6 py-4 font-medium text-neutral-950">
                      {tenant.name}
                      <div className="mt-1 text-xs font-normal text-neutral-500">{tenant.slug}</div>
                    </td>
                    <td className="px-6 py-4">{tenant.ownerEmail}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        {tenant.saasPlan?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
                      >
                        <span className={`size-1.5 rounded-full ${style.dot}`} />
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-neutral-950">
                      {tenant._count?.members ?? 0}
                    </td>
                  </tr>
                );
              })}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500">
                    No gyms to display yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
