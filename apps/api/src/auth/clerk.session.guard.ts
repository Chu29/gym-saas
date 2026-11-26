import { verifyToken } from '@clerk/express';
import {
  type CanActivate,
  createParamDecorator,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

type RequestWithClerkSession = Request & { clerkSessionUserId?: string };

/**
 * Only checks that the caller has a valid Clerk session.
 * It does NOT look the user up in the database, so it works for a member who
 * has just signed up from an invitation and has no database record yet.
 */
@Injectable()
export class ClerkSessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithClerkSession>();
    const header = request.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
    if (!token) throw new UnauthorizedException('Missing session token');

    try {
      const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      request.clerkSessionUserId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}

/** The Clerk user id set by ClerkSessionGuard. */
export const ClerkSessionUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<RequestWithClerkSession>();
    if (!request.clerkSessionUserId) throw new UnauthorizedException('Missing session');
    return request.clerkSessionUserId;
  },
);
