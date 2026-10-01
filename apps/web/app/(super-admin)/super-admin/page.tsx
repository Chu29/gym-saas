interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  totalMembers: number;
  activePlans: number;
}

async function getStats(): Promise<DashboardStats | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/super-admin/stats`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log fetch errors on server
    console.error('Failed to fetch stats from NestJS API:', error);
    return null;
  }
}

export default async function SuperAdminDashboardPage() {
  const stats = await getStats();
  const metrics = [
    { label: 'Total Gyms', value: stats?.totalTenants ?? 0 },
    { label: 'Active Gyms', value: stats?.activeTenants ?? 0 },
    { label: 'Total Members', value: stats?.totalMembers ?? 0 },
    { label: 'Active SaaS Plans', value: stats?.activePlans ?? 0 },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          Platform overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">
          System-wide metrics across all registered gyms.
        </p>
      </header>

      <section
        aria-label="Platform metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric, index) => (
          <article
            key={metric.label}
            className={`rounded-xl border bg-gradient-to-br p-5 shadow-sm shadow-neutral-200/60 ${index % 2 === 0 ? 'border-emerald-100 from-emerald-50/70 to-white' : 'border-green-100 from-green-50/70 to-white'}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {metric.label}
            </p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-neutral-950">
              {metric.value}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
