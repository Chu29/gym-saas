import { getAuth } from '@clerk/express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Retrieve authenticated user claims directly from request
    const authState = getAuth(request);

    if (!authState.userId) {
      throw new UnauthorizedException('Authentication token required');
    }

    // Attach user claims to request context
    request.user = {
      clerkId: authState.userId,
      claims: authState.sessionClaims,
    };

    return true;
  }
}
