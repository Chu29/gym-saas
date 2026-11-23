'use client';

import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Dumbbell,
  Mail,
  Phone,
  Search,
  Shield,
  UserRound,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMember,
  listMembers,
  listMembershipPlans,
  type Member,
  type MemberDetailsUpdate,
  type MemberStatus,
  type MembershipPlanOption,
  recordMemberCheckIn,
  updateMemberDetails,
  updateMemberStatus,
} from '../api/members.api';

type StatusFilter = 'ALL' | MemberStatus;

const STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: 'Active',
  FROZEN: 'Frozen',
  CANCELLED: 'Cancelled',
};

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
}

function initials(member: Member) {
  return `${member.user.firstName[0] ?? ''}${member.user.lastName[0] ?? ''}`.toUpperCase();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlanOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');

  const refreshMembers = useCallback(async (detailId?: string) => {
    setError('');
    try {
      setMembers(await listMembers());
      if (detailId) setSelectedMember(await getMember(detailId));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMembers();
  }, [refreshMembers]);

  useEffect(() => {
    void listMembershipPlans()
      .then(setPlans)
      .catch((requestError: unknown) => setError(getErrorMessage(requestError)));
  }, []);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;
      const searchable = [
        member.user.firstName,
        member.user.lastName,
        member.user.email,
        member.membershipNo,
        member.plan?.name ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [members, query, statusFilter]);

  const activeCount = members.filter((member) => member.status === 'ACTIVE').length;
  const frozenCount = members.filter((member) => member.status === 'FROZEN').length;
  const renewalsSoon = members.filter((member) => {
    if (member.status !== 'ACTIVE' || !member.membershipEndsAt) return false;
    const daysRemaining =
      (new Date(member.membershipEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysRemaining >= 0 && daysRemaining <= 30;
  }).length;

  const runMemberAction = async (
    action: () => Promise<unknown>,
    successMessage: string,
    detailId?: string,
  ) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      setNotice(successMessage);
      await refreshMembers(detailId);
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const exportMembers = () => {
    const rows = [
      ['Name', 'Email', 'Membership number', 'Plan', 'Status', 'Joined', 'Renewal'],
      ...filteredMembers.map((member) => [
        `${member.user.firstName} ${member.user.lastName}`,
        member.user.email,
        member.membershipNo,
        member.plan?.name ?? '',
        STATUS_LABEL[member.status],
        formatDate(member.joinedAt),
        formatDate(member.membershipEndsAt),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gym-members.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const openMember = async (member: Member) => {
    setSelectedMember(member);
    setDetailsLoading(true);
    setEditing(false);
    setError('');
    try {
      setSelectedMember(await getMember(member.id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-7 px-4 py-6 sm:px-7 lg:px-9">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <Dumbbell className="h-4 w-4" />
            GYM OPERATIONS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Members</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
            Keep member profiles, memberships, and attendance in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportMembers}
            disabled={!filteredMembers.length}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Export list
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-100">
            <UsersRound className="h-4 w-4" />
            Signup link coming soon
          </div>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            className="ml-auto font-semibold underline"
            onClick={() => void refreshMembers()}
          >
            Retry
          </button>
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <Check className="h-4 w-4" />
          {notice}
        </div>
      )}

      <section aria-label="Member overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total members"
          value={members.length}
          detail="Across all membership statuses"
          icon={<UsersRound className="h-5 w-5" />}
          color="emerald"
        />
        <SummaryCard
          label="Active"
          value={activeCount}
          detail="Members with active access"
          icon={<Activity className="h-5 w-5" />}
          color="blue"
        />
        <SummaryCard
          label="Frozen"
          value={frozenCount}
          detail="Temporarily paused memberships"
          icon={<Shield className="h-5 w-5" />}
          color="amber"
        />
        <SummaryCard
          label="Renewing soon"
          value={renewalsSoon}
          detail="Membership ends in the next 30 days"
          icon={<CalendarDays className="h-5 w-5" />}
          color="violet"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Member directory</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Search profiles and review each member’s membership at a glance.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-72">
              <span className="sr-only">Search members</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, plan..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />
            </label>
            <label>
              <span className="sr-only">Filter by status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 sm:w-40"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="FROZEN">Frozen</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[790px] text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Member
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Membership
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Last visit
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Renewal
                </th>
                <th scope="col" className="px-5 py-3.5">
                  <span className="sr-only">Open profile</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-slate-500">
                    Loading members…
                  </td>
                </tr>
              ) : filteredMembers.length ? (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="cursor-pointer transition hover:bg-emerald-50/40"
                    onClick={() => void openMember(member)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar member={member} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {member.plan?.name ?? 'No plan assigned'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{member.membershipNo}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={member.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {member.attendance?.[0]
                        ? formatDate(member.attendance[0].checkedInAt)
                        : 'No visits yet'}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatDate(member.membershipEndsAt)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-400">
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-500">
                        <UserRound className="h-6 w-6" />
                      </div>
                      <p className="font-semibold text-slate-900">
                        {members.length ? 'No matching members' : 'No members yet'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {members.length
                          ? 'Try another name or status filter.'
                          : 'When your signup link is ready, new member profiles will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </section>

      {selectedMember && (
        <MemberDetailsPanel
          member={selectedMember}
          detailsLoading={detailsLoading}
          editing={editing}
          busy={busy}
          onClose={() => {
            setSelectedMember(null);
            setEditing(false);
          }}
          onEdit={() => setEditing(true)}
          onCancelEdit={() => setEditing(false)}
          onSave={async (details) => {
            const saved = await runMemberAction(
              () => updateMemberDetails(selectedMember.id, details),
              'Member profile updated.',
              selectedMember.id,
            );
            if (saved) setEditing(false);
          }}
          plans={plans}
          onStatusChange={(status) =>
            void runMemberAction(
              () => updateMemberStatus(selectedMember.id, status),
              status === 'FROZEN' ? 'Membership frozen.' : 'Membership reactivated.',
              selectedMember.id,
            )
          }
          onCancelMembership={() => {
            if (
              window.confirm(
                `Cancel ${selectedMember.user.firstName} ${selectedMember.user.lastName}'s membership?`,
              )
            ) {
              void runMemberAction(
                () => updateMemberStatus(selectedMember.id, 'CANCELLED'),
                'Membership cancelled.',
                selectedMember.id,
              );
            }
          }}
          onCheckIn={() =>
            void runMemberAction(
              () => recordMemberCheckIn(selectedMember.id),
              'Member checked in.',
              selectedMember.id,
            )
          }
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
  color,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'amber' | 'violet';
}) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <span className={`rounded-xl p-2 ${colors[color]}`}>{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function Avatar({ member, large = false }: { member: Member; large?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 ${
        large ? 'h-14 w-14 text-base' : 'h-10 w-10 text-xs'
      }`}
    >
      {initials(member)}
    </div>
  );
}

function StatusPill({ status }: { status: MemberStatus }) {
  const styles: Record<MemberStatus, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    FROZEN: 'bg-amber-50 text-amber-800 ring-amber-200',
    CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function MemberDetailsPanel({
  member,
  detailsLoading,
  editing,
  busy,
  onClose,
  onEdit,
  onCancelEdit,
  onSave,
  onStatusChange,
  onCancelMembership,
  onCheckIn,
  plans,
}: {
  member: Member;
  detailsLoading: boolean;
  editing: boolean;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (details: MemberDetailsUpdate) => Promise<void>;
  onStatusChange: (status: 'ACTIVE' | 'FROZEN') => void;
  onCancelMembership: () => void;
  onCheckIn: () => void;
  plans: MembershipPlanOption[];
}) {
  const [phone, setPhone] = useState(member.phone ?? '');
  const [emergencyContactName, setEmergencyContactName] = useState(
    member.emergencyContactName ?? '',
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    member.emergencyContactPhone ?? '',
  );
  const [notes, setNotes] = useState(member.notes ?? '');
  const [membershipStartsAt, setMembershipStartsAt] = useState(
    member.membershipStartsAt?.slice(0, 10) ?? '',
  );
  const [membershipEndsAt, setMembershipEndsAt] = useState(
    member.membershipEndsAt?.slice(0, 10) ?? '',
  );
  const [planId, setPlanId] = useState(member.plan?.id ?? '');

  useEffect(() => {
    setPhone(member.phone ?? '');
    setEmergencyContactName(member.emergencyContactName ?? '');
    setEmergencyContactPhone(member.emergencyContactPhone ?? '');
    setNotes(member.notes ?? '');
    setMembershipStartsAt(member.membershipStartsAt?.slice(0, 10) ?? '');
    setMembershipEndsAt(member.membershipEndsAt?.slice(0, 10) ?? '');
    setPlanId(member.plan?.id ?? '');
  }, [member]);

  const latestVisit = member.attendance?.[0]?.checkedInAt;
  const planFee = member.plan
    ? formatPrice(member.plan.priceCents, member.plan.currency)
    : 'No active plan';

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Close member profile"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-profile-title"
        className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" /> Directory
          </button>
          <div className="flex gap-2">
            {!editing && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit profile
              </button>
            )}
            {member.status === 'ACTIVE' ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onStatusChange('FROZEN')}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                >
                  Freeze
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onCancelMembership}
                  className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : member.status === 'FROZEN' ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => onStatusChange('ACTIVE')}
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                Reactivate
              </button>
            ) : null}
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar member={member} large />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="member-profile-title" className="text-xl font-bold text-slate-950">
                    {member.user.firstName} {member.user.lastName}
                  </h2>
                  <StatusPill status={member.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{member.membershipNo}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={busy || member.status !== 'ACTIVE'}
              onClick={onCheckIn}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> Check in
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={<WalletCards className="h-4 w-4" />}
              label="Membership plan"
              value={member.plan?.name ?? 'No plan assigned'}
            />
            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Plan fee"
              value={planFee}
              detail={member.plan?.billingCycle?.toLowerCase().replaceAll('_', ' ') ?? ''}
            />
            <InfoCard
              icon={<Clock3 className="h-4 w-4" />}
              label="Member since"
              value={formatDate(member.joinedAt)}
            />
            <InfoCard
              icon={<Activity className="h-4 w-4" />}
              label="Last visit"
              value={latestVisit ? formatDate(latestVisit) : 'No visits recorded'}
            />
            {member.wallet && (
              <InfoCard
                icon={<WalletCards className="h-4 w-4" />}
                label="Service wallet"
                value={`${member.wallet.balance} tokens`}
              />
            )}
          </div>
          <p className="-mt-3 text-xs text-slate-500">
            Plan pricing and renewal dates are shown for staff reference; payment processing is not
            connected yet.
          </p>

          {detailsLoading && (
            <p role="status" className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Loading full member history…
            </p>
          )}

          {editing ? (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void onSave({
                  phone: phone || null,
                  emergencyContactName: emergencyContactName || null,
                  emergencyContactPhone: emergencyContactPhone || null,
                  notes: notes || null,
                  membershipStartsAt: membershipStartsAt || null,
                  membershipEndsAt: membershipEndsAt || null,
                  ...(planId !== (member.plan?.id ?? '') && { planId: planId || null }),
                });
              }}
            >
              <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                <h3 className="mb-4 font-bold text-slate-900">Contact & membership details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Phone number" value={phone} onChange={setPhone} type="tel" />
                  <FormField
                    label="Emergency contact"
                    value={emergencyContactName}
                    onChange={setEmergencyContactName}
                  />
                  <FormField
                    label="Emergency phone"
                    value={emergencyContactPhone}
                    onChange={setEmergencyContactPhone}
                    type="tel"
                  />
                  <FormField
                    label="Membership starts"
                    value={membershipStartsAt}
                    onChange={setMembershipStartsAt}
                    type="date"
                  />
                  <FormField
                    label="Renewal / end date"
                    value={membershipEndsAt}
                    onChange={setMembershipEndsAt}
                    type="date"
                  />
                  <label className="block text-sm font-semibold text-slate-700">
                    Membership plan
                    <select
                      value={planId}
                      onChange={(event) => setPlanId(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    >
                      <option value="">No plan assigned</option>
                      {plans
                        .filter((plan) => plan.isActive || plan.id === member.plan?.id)
                        .map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name}
                            {!plan.isActive ? ' (inactive)' : ''} ·{' '}
                            {formatPrice(plan.priceCents, plan.currency)}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-slate-700">
                  Staff notes
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    maxLength={2000}
                    className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    placeholder="Add notes visible to gym staff"
                  />
                </label>
              </section>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                <h3 className="mb-4 font-bold text-slate-900">Contact & membership</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ContactValue
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={member.user.email}
                  />
                  <ContactValue
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={member.phone || 'Not provided'}
                  />
                  <ContactValue
                    icon={<UserRound className="h-4 w-4" />}
                    label="Emergency contact"
                    value={member.emergencyContactName || 'Not provided'}
                  />
                  <ContactValue
                    icon={<Phone className="h-4 w-4" />}
                    label="Emergency phone"
                    value={member.emergencyContactPhone || 'Not provided'}
                  />
                  <ContactValue
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Membership start"
                    value={formatDate(member.membershipStartsAt)}
                  />
                  <ContactValue
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Renewal / end date"
                    value={formatDate(member.membershipEndsAt)}
                  />
                </div>
                {member.notes && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Staff notes
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-700">
                      {member.notes}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Attendance</h3>
                    <p className="mt-0.5 text-sm text-slate-500">Most recent check-ins</p>
                  </div>
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-700">
                    <Activity className="h-4 w-4" />
                  </span>
                </div>
                {member.attendance?.length ? (
                  <ul className="divide-y divide-slate-100">
                    {member.attendance.map((visit) => (
                      <li
                        key={visit.id}
                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {formatDate(visit.checkedInAt)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(
                            new Date(visit.checkedInAt),
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                    No visits recorded yet.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="text-emerald-700">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
      {detail && <p className="mt-0.5 text-xs capitalize text-slate-500">{detail}</p>}
    </article>
  );
}

function ContactValue({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
      />
    </label>
  );
}
