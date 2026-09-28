async function getStats() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/super-admin/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return {
      totalTenants: 0,
      activeTenants: 0,
      totalMembers: 0,
      activePlans: 0,
    };
  }
  return res.json();
}

export default async function SuperAdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Platform Dashboard</h2>
        <p className="text-sm text-slate-400">System-wide metrics across all registered gyms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase">Total Gyms</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{stats.totalTenants}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase">Active Gyms</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-400">{stats.activeTenants}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase">Total Members</p>
          <p className="mt-2 text-3xl font-extrabold text-indigo-400">{stats.totalMembers}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase">Active SaaS Plans</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-400">{stats.activePlans}</p>
        </div>
      </div>
    </div>
  );
}
