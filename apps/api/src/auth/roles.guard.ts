import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@repo/database';
import type { AuthedRequest } from './auth-user.js';
import { ROLES_KEY } from './roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Bypass role enforcement in local development
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const user = context.switchToHttp().getRequest<AuthedRequest>().user;

    // Fail closed: no user or no declared roles means no access.
    if (!user || !required?.length || !required.includes(user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
