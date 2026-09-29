interface SaaSPlan {
  id: string;
  name: string;
  price: number;
  maxMembers: number;
}

async function getPlans(): Promise<SaaSPlan[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/super-admin/plans`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log fetch errors on server
    console.error('Failed to fetch SaaS plans:', error);
    return [];
  }
}

export default async function SaaSPlansPage() {
  const plans = await getPlans();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          Platform management
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">
          SaaS subscription plans
        </h1>
        <p className="mt-2 text-sm text-neutral-600">Review global plans and member limits.</p>
      </header>

      {plans.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-neutral-900">No plans to display</p>
          <p className="mt-1 text-sm text-neutral-600">
            Plans will appear here once they are available from the platform API.
          </p>
        </div>
      ) : (
        <section aria-label="SaaS plans" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-6 shadow-sm shadow-neutral-200/50"
            >
              <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                Platform plan
              </span>
              <h2 className="mt-4 text-xl font-bold text-neutral-950">{plan.name}</h2>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-950">
                ${plan.price.toLocaleString()}{' '}
                <span className="text-sm font-medium text-neutral-500">/ mo</span>
              </p>
              <div className="mt-6 border-t border-emerald-100 pt-4 text-sm text-neutral-600">
                Member limit{' '}
                <span className="float-right font-semibold text-neutral-950">
                  {plan.maxMembers.toLocaleString()}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
