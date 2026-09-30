import type { UserRole } from '@repo/database';
import type { Request } from 'express';

export interface AuthUser {
  id: string;
  tenantId: string;
  role: UserRole;
}

export type AuthedRequest = Request & { user?: AuthUser };
