import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role !== 'SUPER_ADMIN' || user.tenantId !== null) {
      throw new ForbiddenException('Access denied: Super Admin privilege required');
    }

    return true;
  }
}
