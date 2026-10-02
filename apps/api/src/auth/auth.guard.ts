import { getAuth } from '@clerk/express';
import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { PrismaClient } from '@repo/database';
import { PRISMA } from '../prisma/prisma.module.js';
import type { AuthedRequest } from './auth-user.js';

const OBJECT_ID = /^[0-9a-f]{24}$/i;

/**
 * DEV-ONLY STUB. Replace with real JWT/session verification before production.
 *
 * It trusts only `x-dev-user-id`; tenantId and role are ALWAYS loaded from the
 * database, never from the request, so the rest of the code can rely on
 * `req.user` regardless of how authentication is eventually implemented.
 * Refuses to run when NODE_ENV=production.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Authentication is not configured');
    }
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const clerkUserId = getAuth(req).userId;
    let user: any = null;

    if (clerkUserId) {
      user = await this.prisma.user.findUnique({ where: { clerkId: clerkUserId } });
    } else {
      const header = req.headers['x-dev-user-id'];
      const userId = typeof header === 'string' ? header : undefined;
      if (!userId || !OBJECT_ID.test(userId)) throw new UnauthorizedException();
      user = await this.prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user?.isActive) throw new UnauthorizedException();

    req.user = {
      id: user.id,
      tenantId: user.tenantId ?? '',
      role: user.role,
    };
    return true;
  }
}
