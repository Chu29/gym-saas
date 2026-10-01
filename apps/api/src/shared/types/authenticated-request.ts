import { UserRole } from '@repo/database';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: { tenantId: string; role: UserRole };
}
