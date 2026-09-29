import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Super Admin access required'); // Triggers 403 / 401
    }

    return true;
  }
}
