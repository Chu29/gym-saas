import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { RolesGuard } from './roles.guard.js';

const ctx = (user?: { role: string }) =>
  ({
    getHandler: () => null,
    getClass: () => null,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

const guard = (roles?: string[]) => new RolesGuard({ getAllAndOverride: () => roles } as never);

describe('RolesGuard', () => {
  it('allows GYM_ADMIN', () => {
    expect(guard(['GYM_ADMIN']).canActivate(ctx({ role: 'GYM_ADMIN' }))).toBe(true);
  });
  it.each(['FRONT_DESK', 'TRAINER', 'MEMBER'])('rejects %s', (role) => {
    expect(() => guard(['GYM_ADMIN']).canActivate(ctx({ role }))).toThrow(ForbiddenException);
  });
  it('fails closed with no user or no roles metadata', () => {
    expect(() => guard(['GYM_ADMIN']).canActivate(ctx())).toThrow(ForbiddenException);
    expect(() => guard(undefined).canActivate(ctx({ role: 'GYM_ADMIN' }))).toThrow(
      ForbiddenException,
    );
  });
});
