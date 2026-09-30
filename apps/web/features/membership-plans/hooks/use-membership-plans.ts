'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from '../api/membership-plans.api';
import type { MembershipPlanFormValues } from '../lib/schema';

const KEY = ['membership-plans'];

export function useMembershipPlans() {
  return useQuery({ queryKey: KEY, queryFn: api.getMembershipPlans });
}

export function useCreateMembershipPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MembershipPlanFormValues) => api.createMembershipPlan(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Membership plan created');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create plan'),
  });
}

export function useDeactivateMembershipPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deactivateMembershipPlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Plan deactivated');
    },
  });
}
