'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createService, type ServiceCategory, updateService } from '../../../../lib/services-api';

const PAGE = '/admin/services';

// Refresh the list, then go back to it (with an error banner if something failed).
function done(message?: string): never {
  revalidatePath(PAGE);
  redirect(message ? `${PAGE}?error=${encodeURIComponent(message)}` : PAGE);
}

function readFields(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    category: String(formData.get('category') ?? '') as ServiceCategory,
    tokenCost: Number(formData.get('tokenCost')),
  };
}

export async function createServiceAction(formData: FormData) {
  const { description, ...rest } = readFields(formData);
  const result = await createService({ ...rest, ...(description && { description }) });
  done(result.ok ? undefined : result.message);
}

export async function updateServiceAction(id: string, formData: FormData) {
  const result = await updateService(id, readFields(formData));
  done(result.ok ? undefined : result.message);
}

export async function setActiveAction(id: string, isActive: boolean) {
  const result = await updateService(id, { isActive });
  done(result.ok ? undefined : result.message);
}
