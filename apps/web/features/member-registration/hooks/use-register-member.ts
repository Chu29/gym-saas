'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerMember } from '../api/registration.api';
import type { RegisterMemberValues } from '../lib/schema';

export function useRegisterMember() {
  const { getToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterMemberValues) => {
      const token = await getToken();
      return registerMember(data, token ?? undefined);
    },
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['member-invitations'] });
      toast.success(`Invitation sent to ${variables.email}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
