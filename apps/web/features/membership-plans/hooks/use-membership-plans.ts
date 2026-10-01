'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from '../api/membership-plans.api';
import type { MembershipPlanFormValues } from '../lib/schema';

const KEY = ['membership-plans'];

export function useMembershipPlans() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const token = await getToken();

      return api.getMembershipPlans(token ?? undefined);
    },
  });
}

export function useCreateMembershipPlan() {
  const { getToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: MembershipPlanFormValues) => {
      const token = await getToken();

      return api.createMembershipPlan(data, token ?? undefined);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Membership plan created');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create plan');
    },
  });
}

export function useDeactivateMembershipPlan() {
  const { getToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();

      return api.deactivateMembershipPlan(id, token ?? undefined);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Plan deactivated');
    },
  });
}
