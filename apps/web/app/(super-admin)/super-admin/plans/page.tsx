'use client';

import { useCallback, useEffect, useState } from 'react';
import { PlanModal } from './_components/PlanModal';

interface SaaSPlan {
  id: string;
  name: string;
  code: string;
  priceCents: number;
  currency: string;
  maxMembers: number;
  maxStaff?: number;
  description?: string | null;
  stripePriceId?: string | null;
  isActive: boolean;
}

export default function PlansPage() {
  const [_plans, setPlans] = useState<SaaSPlan[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [_modalOpen, setModalOpen] = useState(false);
  const [_editingPlan, setEditingPlan] = useState<SaaSPlan | null>(null);
  // Tracks which plan currently has a publish/delete request in flight,
  // so we can disable just that row's buttons instead of the whole page.
  const [_pendingId, setPendingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const authHeaders = useCallback((): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/super-admin/plans`, {
        headers: authHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Failed to load plans (${res.status})`);
      }
      const data: SaaSPlan[] = await res.json();
      setPlans(data);
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: surfacing plan list fetch errors
      console.error('Failed to fetch SaaS plans:', err);
      setError("Couldn't load plans. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeaders]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  function handleCreate() {
    setEditingPlan(null);
    setModalOpen(true);
  }

  function _handleEdit(plan: SaaSPlan) {
    setEditingPlan(plan);
    setModalOpen(true);
  }

  async function _handleTogglePublish(plan: SaaSPlan) {
    setPendingId(plan.id);
    try {
      const res = await fetch(`${apiUrl}/super-admin/plans/${plan.id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // biome-ignore lint/suspicious/noConsole: surfacing publish toggle API errors
        console.error('Failed to toggle plan publish state:', errorData);
        return;
      }
      await fetchPlans();
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: surfacing publish toggle exceptions
      console.error('Failed to toggle plan publish state:', err);
    } finally {
      setPendingId(null);
    }
  }

  async function _handleDelete(plan: SaaSPlan) {
    const confirmed = window.confirm(`Delete "${plan.name}"? This can't be undone.`);
    if (!confirmed) return;

    setPendingId(plan.id);
    try {
      const res = await fetch(`${apiUrl}/super-admin/plans/${plan.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // biome-ignore lint/suspicious/noConsole: surfacing delete API errors
        console.error('Failed to delete plan:', errorData);
        window.alert(errorData?.message || 'Failed to delete plan.');
        return;
      }
      await fetchPlans();
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: surfacing delete exceptions
      console.error('Failed to delete plan:', err);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
            FITNEXA Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-neutral-600">Review global plans, limits, and pricing.</p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
        >
          + Add New Plan
        </button>
      </header>

      {_error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {_error}
        </div>
      )}

      {_loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading plans…</p>
      ) : (
        <section aria-label="SaaS plans" className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {_plans.map((plan) => (
            <article
              key={plan.id}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-700">
                  Platform Plan
                  {!plan.isActive && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      Draft
                    </span>
                  )}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-neutral-950">{plan.name}</h2>
              <p className="mt-2 text-3xl font-extrabold text-neutral-950">
                ${(plan.priceCents / 100).toLocaleString()}
                <span className="text-sm font-medium text-neutral-500"> / mo</span>
              </p>
              <div className="mt-6 space-y-1 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
                <div>
                  Member limit:{' '}
                  <span className="float-right font-semibold text-neutral-950">
                    {plan.maxMembers.toLocaleString()}
                  </span>
                </div>
                {plan.maxStaff !== undefined && (
                  <div>
                    Staff limit:{' '}
                    <span className="float-right font-semibold text-neutral-950">
                      {plan.maxStaff.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => _handleEdit(plan)}
                  disabled={_pendingId === plan.id}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => _handleTogglePublish(plan)}
                  disabled={_pendingId === plan.id}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                    plan.isActive
                      ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {plan.isActive ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => _handleDelete(plan)}
                  disabled={_pendingId === plan.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {_plans.length === 0 && (
            <p className="text-sm text-neutral-500">No plans yet. Create one to get started.</p>
          )}
        </section>
      )}

      <PlanModal
        isOpen={_modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchPlans();
        }}
        initialData={_editingPlan}
      />
    </div>
  );
}
