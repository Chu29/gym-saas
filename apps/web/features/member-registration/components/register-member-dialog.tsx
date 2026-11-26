'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMembershipPlans } from '../../membership-plans/hooks/use-membership-plans';
import { useRegisterMember } from '../hooks/use-register-member';
import { type RegisterMemberValues, registerMemberSchema } from '../lib/schema';

const inputClass =
  'w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600';

export function RegisterMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const registerMember = useRegisterMember();
  const { data: plans = [] } = useMembershipPlans();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterMemberValues>({
    resolver: zodResolver(registerMemberSchema),
    defaultValues: { firstName: '', lastName: '', email: '', planId: '' },
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  function onSubmit(values: RegisterMemberValues) {
    registerMember.mutate(
      { ...values, planId: values.planId || undefined },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Register Member</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              We&apos;ll email them a link to verify their address and set a password.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="rm-first-name" className="mb-1 block text-xs font-bold text-gray-900">
                First name *
              </label>
              <input id="rm-first-name" {...register('firstName')} className={inputClass} />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="rm-last-name" className="mb-1 block text-xs font-bold text-gray-900">
                Last name *
              </label>
              <input id="rm-last-name" {...register('lastName')} className={inputClass} />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="rm-email" className="mb-1 block text-xs font-bold text-gray-900">
              Email *
            </label>
            <input
              id="rm-email"
              type="email"
              placeholder="member@example.com"
              {...register('email')}
              className={inputClass}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="rm-plan" className="mb-1 block text-xs font-bold text-gray-900">
              Membership plan
            </label>
            <select id="rm-plan" {...register('planId')} className={inputClass}>
              <option value="">No plan yet</option>
              {plans
                .filter((p: { isActive: boolean }) => p.isActive)
                .map((p: { id: string; name: string }) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={registerMember.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Mail className="h-4 w-4" />
              {registerMember.isPending ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
