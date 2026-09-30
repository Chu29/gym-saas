'use client';

import { useEffect, useState } from 'react';

// Shape as it comes from / goes to the API.
interface SaaSPlan {
  id?: string;
  name: string;
  code?: string;
  priceCents: number;
  maxMembers: number;
  maxStaff?: number;
  description?: string | null;
}

// Internal form state keeps price as a plain dollar amount for the input
// field; it's converted to/from priceCents at the API boundary.
interface FormState {
  name: string;
  code: string;
  price: number; // dollars, not cents — converted on load and on submit
  maxMembers: number;
  maxStaff: number;
  description: string;
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SaaSPlan | null;
}

export function PlanModal({ isOpen, onClose, onSuccess, initialData }: PlanModalProps) {
  const isEditing = Boolean(initialData?.id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    name: '',
    code: '',
    price: 0,
    maxMembers: 100,
    maxStaff: 10,
    description: '',
  });

  // Sync state whenever initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? '',
        code: initialData.code ?? '',
        price: (initialData.priceCents ?? 0) / 100,
        maxMembers: initialData.maxMembers ?? 100,
        maxStaff: initialData.maxStaff ?? 10,
        description: initialData.description ?? '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        price: 0,
        maxMembers: 100,
        maxStaff: 10,
        description: '',
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = isEditing
        ? `${apiUrl}/super-admin/plans/${initialData?.id}`
        : `${apiUrl}/super-admin/plans`;

      const token = localStorage.getItem('token');

      // Construct payload ensuring code and maxStaff exist
      const payload = {
        name: formData.name.trim(),
        code: formData.code?.trim()
          ? formData.code.trim().toUpperCase()
          : formData.name.trim().toUpperCase().replace(/\s+/g, '_'),
        priceCents: Math.round(Number(formData.price) * 100),
        maxMembers: Number(formData.maxMembers),
        maxStaff: Number(formData.maxStaff),
        description: formData.description?.trim() || undefined,
      };

      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        // biome-ignore lint/suspicious/noConsole: Log plan modal API response errors
        console.error('API error response:', errorData);
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Log plan modal API exceptions
      console.error('Failed to save SaaS plan:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-900">
          {isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Set up pricing and capacity limits for gym tenants.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="plan-name"
              className="block text-xs font-medium text-neutral-700 uppercase tracking-wide"
            >
              Plan Name
            </label>
            <input
              id="plan-name"
              type="text"
              required
              placeholder="e.g. Starter, Pro, Enterprise"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="plan-code"
              className="block text-xs font-medium text-neutral-700 uppercase tracking-wide"
            >
              Plan Code (Unique Identifer)
            </label>
            <input
              id="plan-code"
              type="text"
              placeholder="e.g. STARTER, PRO (Auto-generated if blank)"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="plan-price"
              className="block text-xs font-medium text-neutral-700 uppercase tracking-wide"
            >
              Price ($ / mo)
            </label>
            <input
              id="plan-price"
              type="number"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="plan-max-members"
                className="block text-xs font-medium text-neutral-700 uppercase tracking-wide"
              >
                Max Members
              </label>
              <input
                id="plan-max-members"
                type="number"
                min="1"
                required
                value={formData.maxMembers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxMembers: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="plan-max-staff"
                className="block text-xs font-medium text-neutral-700 uppercase tracking-wide"
              >
                Max Staff
              </label>
              <input
                id="plan-max-staff"
                type="number"
                min="1"
                required
                value={formData.maxStaff}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStaff: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
