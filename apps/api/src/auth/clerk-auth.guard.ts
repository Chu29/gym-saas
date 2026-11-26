import { getAuth } from '@clerk/express';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@repo/database';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private demoTenantId: string | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let userId: string | null | undefined = getAuth(request)?.userId;
    let claims: Record<string, unknown> | null | undefined = getAuth(request)?.sessionClaims as
      | Record<string, unknown>
      | undefined;

    // Decode bearer token if dev-browser cookie wasn't synced across ports
    if (!userId && request.headers?.authorization) {
      try {
        const token = request.headers.authorization.replace('Bearer ', '');
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          userId = decoded.sub;
          claims = decoded;
        }
      } catch {
        // Fallback parse failed silently for production/linter safety
      }
    }

    if (!userId) {
      throw new UnauthorizedException('Authentication token required');
    }

    // Role from metadata or fallback to GYM_ADMIN in development
    const metadata = (claims?.metadata as Record<string, unknown>) || {};
    const role = (metadata.role as UserRole) || UserRole.GYM_ADMIN;

    // Resolve tenantId: from token metadata, header, or query the seeded demo-gym
    let tenantId =
      (metadata.tenantId as string | undefined) ||
      (claims?.org_id as string | undefined) ||
      (request.headers['x-tenant-id'] as string | undefined);

    if (!tenantId) {
      if (!this.demoTenantId) {
        const tenant = await this.prisma.tenant.findUnique({
          where: { slug: 'demo-gym' },
          select: { id: true },
        });
        if (tenant) {
          this.demoTenantId = tenant.id;
        }
      }
      tenantId = this.demoTenantId ?? undefined;
    }

    request.user = {
      clerkId: userId,
      role,
      tenantId,
      claims,
    };

    return true;
  }
}
