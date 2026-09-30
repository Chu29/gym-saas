// apps/web/features/membership-plans/components/create-membership-plan-dialog.tsx
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ClipboardCheck,
  Maximize2,
  Plus,
  ShowerHead,
  Star,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateMembershipPlan } from '../hooks/use-membership-plans';
import { type MembershipPlanFormValues, membershipPlanFormSchema } from '../lib/schema';

const AVAILABLE_PERKS = [
  { label: 'Full Gym Floor Access', icon: Maximize2 },
  { label: 'Locker Room & Showers', icon: ShowerHead },
  { label: 'Free Fitness Assessment', icon: ClipboardCheck },
  { label: 'Group Class Access', icon: Users },
  { label: 'Guest Pass (1 per month)', icon: Ticket },
  { label: 'Priority Booking', icon: Star },
];
export function CreateMembershipPlanDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createPlan = useCreateMembershipPlan();
  const id = useId();
  const fieldId = (field: string) => `${id}-${field}`;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationValue: 1,
      durationUnit: 'MONTH',
      billingCycle: 'MONTHLY',
      isActive: true,
      perks: [],
    },
  });
  const perks = watch('perks');
  const isActive = watch('isActive');
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);
  if (!open) return null;
  function togglePerk(perk: string) {
    setValue('perks', perks.includes(perk) ? perks.filter((p) => p !== perk) : [...perks, perk]);
  }
  function onSubmit(values: MembershipPlanFormValues) {
    createPlan.mutate(values, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6 pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              CATALOG CONFIGURATION
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
              Create Membership Plan
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Add a new reusable membership package to your gym&apos;s catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 min-w-0">
          {/* Plan Name */}
          <div className="min-w-0">
            <label htmlFor={fieldId('name')} className="mb-1 block text-xs font-bold text-gray-900">
              Plan Name *
            </label>
            <input
              id={fieldId('name')}
              {...register('name')}
              placeholder="Monthly Membership"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-colors min-w-0"
            />
            <p className="mt-1 text-[11px] text-gray-500 leading-tight">
              The customer-facing title displayed on registration and receipts.
            </p>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          {/* Description */}
          <div className="min-w-0">
            <label
              htmlFor={fieldId('description')}
              className="mb-1 block text-xs font-bold text-gray-900"
            >
              Description
            </label>
            <textarea
              id={fieldId('description')}
              {...register('description')}
              rows={3}
              placeholder="Access to the gym including locker rooms, cardio zone, and complimentary orientation."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-colors min-w-0"
            />
            <p className="mt-1 text-[11px] text-gray-500 leading-tight">
              Short summary outlining key equipment access and member expectations.
            </p>
          </div>
          {/* Price */}
          <div className="min-w-0">
            <label
              htmlFor={fieldId('price')}
              className="mb-1 block text-xs font-bold text-gray-900"
            >
              Price (FCFA) *
            </label>
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-600 transition-colors min-w-0">
              <span className="pl-3.5 text-xs sm:text-sm font-semibold text-gray-500">F</span>
              <input
                id={fieldId('price')}
                type="number"
                min={0}
                placeholder="15,000"
                {...register('price', { valueAsNumber: true })}
                className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 outline-none min-w-0"
              />
              <span className="mr-3 text-[10px] font-bold text-gray-400 tracking-wider">XAF</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500 leading-tight">
              Standard price charged per renewal cycle in Central African Francs.
            </p>
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
          </div>
          {/* Duration & Duration Unit */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-w-0">
            <div className="min-w-0">
              <label
                htmlFor={fieldId('durationValue')}
                className="mb-1 block text-xs font-bold text-gray-900"
              >
                Duration *
              </label>
              <input
                id={fieldId('durationValue')}
                type="number"
                min={1}
                {...register('durationValue', { valueAsNumber: true })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-colors min-w-0"
              />
            </div>
            <div className="min-w-0">
              <label
                htmlFor={fieldId('durationUnit')}
                className="mb-1 block text-xs font-bold text-gray-900"
              >
                Duration Unit *
              </label>
              <div className="relative">
                <select
                  id={fieldId('durationUnit')}
                  {...register('durationUnit')}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-colors min-w-0"
                >
                  <option value="DAY">Day(s)</option>
                  <option value="MONTH">Month(s)</option>
                  <option value="YEAR">Year(s)</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  ▼
                </span>
              </div>
            </div>
          </div>
          {/* Billing Cycle */}
          <div className="min-w-0">
            <label
              htmlFor={fieldId('billingCycle')}
              className="mb-1 block text-xs font-bold text-gray-900"
            >
              Billing Cycle *
            </label>
            <div className="relative">
              <select
                id={fieldId('billingCycle')}
                {...register('billingCycle')}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-colors min-w-0"
              >
                <option value="MONTHLY">Monthly (Auto-invoice each month)</option>
                <option value="QUARTERLY">Quarterly (Auto-invoice every 3 months)</option>
                <option value="HALF_YEARLY">Half-Yearly (Auto-invoice every 6 months)</option>
                <option value="ANNUAL">Annual (Auto-invoice yearly)</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                ▼
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500 leading-tight">
              Defines automated batch billing generation cadence via POS &amp; Mobile Money.
            </p>
          </div>
          {/* Active Plan Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900">Active Plan</span>
                {isActive && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Immediately available for staff at reception and online signup.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-label="Active Plan"
              onClick={() => setValue('isActive', !isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {/* Entitlements / Perks */}
          {/* Entitlements / Perks */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">
                Included Entitlements / Access Perks
              </span>
              <span className="text-xs font-medium text-gray-500">
                {perks.length} of {AVAILABLE_PERKS.length} selected
              </span>
            </div>
            <div className="space-y-2 rounded-xl border border-gray-200 p-3 min-w-0">
              {AVAILABLE_PERKS.map(({ label, icon: Icon }) => {
                const checked = perks.includes(label);
                return (
                  <label
                    key={label}
                    className="flex w-full cursor-pointer items-center justify-between py-1 text-xs sm:text-sm text-gray-700 hover:text-gray-900 select-none min-w-0"
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => togglePerk(label)}
                    />
                    <span className="flex items-center gap-2.5 truncate">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </span>
                      <span className="truncate font-medium">{label}</span>
                    </span>
                    <Icon className="h-4 w-4 shrink-0 text-gray-400 ml-2" />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPlan.isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {createPlan.isPending ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
