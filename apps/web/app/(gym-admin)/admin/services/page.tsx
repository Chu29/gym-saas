import Link from 'next/link';
import {
  listServices,
  SERVICE_CATEGORIES,
  type Service,
  type ServiceCategory,
} from '../../../../lib/services-api';
import { Icon } from '../../_components/icon';
import { createServiceAction, setActiveAction, updateServiceAction } from './actions';

const CATEGORY_META: Record<ServiceCategory, { label: string; icon: string; tint: string }> = {
  SAUNA: { label: 'Sauna', icon: 'local_fire_department', tint: 'bg-amber-100/60 text-amber-700' },
  PERSONAL_TRAINING: {
    label: 'Personal training',
    icon: 'fitness_center',
    tint: 'bg-emerald-100/70 text-emerald-800',
  },
  POOL: { label: 'Pool', icon: 'pool', tint: 'bg-cyan-100/70 text-cyan-800' },
  GROUP_CLASS: { label: 'Group class', icon: 'groups', tint: 'bg-purple-100/70 text-purple-800' },
  SPA: { label: 'Spa', icon: 'spa', tint: 'bg-teal-100/70 text-teal-800' },
  OTHER: { label: 'Other', icon: 'category', tint: 'bg-orange-100/70 text-orange-800' },
};

const fieldClass =
  'w-full rounded-2xl bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20';
const pillBase = 'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors';
const pillOn = 'bg-primary text-on-primary';
const pillOff =
  'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface';
const ghostBtn =
  'rounded-full bg-surface-container px-4 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high';
const primaryBtn =
  'inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-primary-container px-6 text-sm font-semibold text-on-primary shadow-md transition-colors hover:bg-primary';

const STATUS_TABS = [
  { key: 'active', text: 'Active' },
  { key: 'inactive', text: 'Inactive' },
  { key: 'all', text: 'All' },
] as const;

function Fields({ service }: { service?: Service }) {
  return (
    <div className="grid gap-3">
      <label className="grid gap-1 text-xs font-semibold">
        Service name
        <input
          name="name"
          required
          maxLength={100}
          defaultValue={service?.name}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1 text-xs font-semibold">
        Category
        <select name="category" defaultValue={service?.category ?? 'OTHER'} className={fieldClass}>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold">
        Tokens per use
        <input
          name="tokenCost"
          type="number"
          min={1}
          step={1}
          required
          defaultValue={service?.tokenCost}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1 text-xs font-semibold">
        Description (optional)
        <textarea
          name="description"
          rows={2}
          maxLength={500}
          defaultValue={service?.description ?? ''}
          className={`${fieldClass} resize-none`}
        />
      </label>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <p className="text-[11px] font-bold text-on-surface-variant">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold">{value}</span>
        <span className="text-xs text-on-surface-variant">{unit}</span>
      </p>
    </div>
  );
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; error?: string }>;
}) {
  const { status: rawStatus, category: rawCategory, error } = await searchParams;
  const status = rawStatus === 'inactive' || rawStatus === 'all' ? rawStatus : 'active';
  const category = SERVICE_CATEGORIES.find((c) => c === rawCategory);

  const result = await listServices();
  const all = result.ok ? result.data : [];
  const inStatus = all.filter((s) => status === 'all' || s.isActive === (status === 'active'));
  const visible = inStatus.filter((s) => !category || s.category === category);
  const active = all.filter((s) => s.isActive);
  const average = active.length
    ? (active.reduce((sum, s) => sum + s.tokenCost, 0) / active.length).toFixed(1)
    : '–';
  const highest = active.length ? Math.max(...active.map((s) => s.tokenCost)) : '–';

  const href = (nextStatus: string, nextCategory?: string) =>
    `/admin/services?status=${nextStatus}${nextCategory ? `&category=${nextCategory}` : ''}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
            Services
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-on-surface">Service catalog</span>
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Services and token rates</h1>
          <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
            Create the services members can pay for with tokens, set what each use costs, and turn
            them off without losing their history.
          </p>
        </div>
        <Link href="#new-service" className={primaryBtn}>
          <Icon name="add" className="text-[18px]" />
          Create new service
        </Link>
      </header>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container"
        >
          {error}
        </p>
      )}

      <div className="grid items-start gap-8 xl:grid-cols-12">
        <div className="grid min-w-0 gap-6 xl:col-span-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Active services" value={active.length} unit="live" />
            <Metric label="Inactive" value={all.length - active.length} unit="paused" />
            <Metric label="Average cost" value={average} unit="tokens / use" />
            <Metric label="Highest cost" value={highest} unit="tokens / use" />
          </div>

          <div className="grid gap-3 rounded-3xl bg-surface-container-lowest p-4 shadow-sm">
            <nav aria-label="Status" className="flex gap-2 overflow-x-auto">
              {STATUS_TABS.map((tab) => (
                <Link
                  key={tab.key}
                  href={href(tab.key, category)}
                  className={`${pillBase} ${status === tab.key ? pillOn : pillOff}`}
                >
                  {tab.text}
                </Link>
              ))}
            </nav>
            <nav aria-label="Category" className="flex gap-2 overflow-x-auto">
              <Link href={href(status)} className={`${pillBase} ${category ? pillOff : pillOn}`}>
                All categories ({inStatus.length})
              </Link>
              {SERVICE_CATEGORIES.map((c) => {
                const count = inStatus.filter((s) => s.category === c).length;
                if (count === 0 && category !== c) return null;
                return (
                  <Link
                    key={c}
                    href={href(status, c)}
                    className={`${pillBase} ${category === c ? pillOn : pillOff}`}
                  >
                    {CATEGORY_META[c].label} ({count})
                  </Link>
                );
              })}
            </nav>
          </div>

          {!result.ok ? (
            <p
              role="alert"
              className="rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container"
            >
              {result.message}
            </p>
          ) : visible.length === 0 ? (
            <p className="rounded-3xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant shadow-sm">
              No services match these filters. Use the form to add one.
            </p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {visible.map((service) => {
                const meta = CATEGORY_META[service.category];
                return (
                  <li
                    key={service.id}
                    className="grid content-between gap-4 rounded-3xl bg-surface-container-lowest p-6 shadow-sm"
                  >
                    <div className="grid gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.tint}`}
                          >
                            <Icon name={meta.icon} className="text-[26px]" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold leading-tight">
                              {service.name}
                            </h2>
                            <p className="text-xs text-on-surface-variant">{meta.label}</p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            service.isActive
                              ? 'bg-primary-fixed/50 text-on-primary-fixed-variant'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-3">
                        <span className="text-xs text-on-surface-variant">Cost per use</span>
                        <span className="font-bold">{service.tokenCost} tokens</span>
                      </div>
                      {service.description && (
                        <p className="text-sm text-on-surface-variant">{service.description}</p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <form action={setActiveAction.bind(null, service.id, !service.isActive)}>
                          <button type="submit" className={ghostBtn}>
                            {service.isActive ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </form>
                      </div>
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-semibold text-primary">
                          Edit service
                        </summary>
                        <form
                          action={updateServiceAction.bind(null, service.id)}
                          className="mt-3 grid gap-3"
                        >
                          <Fields service={service} />
                          <button type="submit" className={`${ghostBtn} justify-self-start`}>
                            Save changes
                          </button>
                        </form>
                      </details>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <section
          id="new-service"
          className="scroll-mt-24 rounded-3xl bg-surface-container-lowest p-6 shadow-md xl:sticky xl:top-8 xl:col-span-4"
        >
          <h2 className="mb-4 text-lg font-semibold">New service</h2>
          <form action={createServiceAction} className="grid gap-5">
            <Fields />
            <button type="submit" className={primaryBtn}>
              <Icon name="check_circle" className="text-[18px]" />
              Create service
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
