interface Tenant {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  saasPlan?: {
    name: string;
  };
  _count?: {
    members: number;
  };
}

async function getTenants(): Promise<Tenant[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/super-admin/tenants`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SuperAdminTenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Registered Gyms</h2>
          <p className="text-sm text-slate-400">View and manage tenant status and subscriptions.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/80 text-xs text-slate-400 uppercase">
            <tr>
              <th className="px-6 py-3">Gym Name / Slug</th>
              <th className="px-6 py-3">Owner Email</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Members</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40">
                <td className="px-6 py-4 font-medium text-white">
                  {t.name}
                  <div className="text-xs text-slate-500">{t.slug}</div>
                </td>
                <td className="px-6 py-4">{t.ownerEmail}</td>
                <td className="px-6 py-4">
                  <span className="rounded bg-indigo-950 px-2 py-1 text-xs font-semibold text-indigo-300">
                    {t.saasPlan?.name || 'Unassigned'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      t.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-rose-950 text-rose-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4">{t._count?.members || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
