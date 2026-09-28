import type { TenantStatus } from '@repo/database';

export class UpdateTenantStatusDto {
  status?: TenantStatus;
  saasPlanId?: string;
}
