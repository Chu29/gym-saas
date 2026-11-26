import { createClerkClient } from '@clerk/express';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';

@Injectable()
export class TenantService {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  private readonly logger = new Logger(TenantService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createGymTenant(clerkId: string, dto: CreateTenantDto) {
    const formattedSlug = dto.slug.toLowerCase().trim().replace(/\s+/g, '-');

    // Log the selected plan for debugging
    if (dto.plan) {
      this.logger.log(`User ${clerkId} selected plan: ${dto.plan}`);
    }

    // Check if user exists and already has a tenant
    const existingUser = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { tenant: true },
    });

    const clerkUser = await this.clerkClient.users.getUser(clerkId);
    const ownerEmail = clerkUser.emailAddresses[0]?.emailAddress;

    if (!ownerEmail) {
      throw new ConflictException('Your Clerk account does not have an email address.');
    }

    if (existingUser?.tenantId) {
      throw new ConflictException('You already have a gym tenant.');
    }

    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: formattedSlug },
    });

    if (existingTenant) {
      throw new ConflictException('This gym URL slug is already taken.');
    }

    // Atomic transaction: Create Tenant and assign owner User role
    const tenant = await this.prisma
      .$transaction(async (tx: Prisma.TransactionClient) => {
        const newTenant = await tx.tenant.create({
          data: {
            name: dto.name,
            slug: formattedSlug,
            status: 'TRIAL',
            ownerEmail,
          },
        });

        await tx.user.upsert({
          where: { clerkId },
          update: {
            tenantId: newTenant.id,
            role: 'GYM_ADMIN',
          },
          create: {
            clerkId,
            email: ownerEmail, // Syncs via Clerk Webhook
            firstName: '',
            lastName: '',
            role: 'GYM_ADMIN',
            tenantId: newTenant.id,
          },
        });

        return newTenant;
      })
      .catch((error) => {
        // Catch Prisma P2002 unique constraint violation for concurrent duplicate-slug requests
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new ConflictException('This gym URL slug is already taken.');
        }
        throw error;
      });

    // Update Clerk public metadata so future JWTs carry tenantId and gymName
    try {
      await this.clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          role: 'GYM_ADMIN',
          tenantId: tenant.id,
          gymName: tenant.name,
        },
        unsafeMetadata: {
          role: 'GYM_ADMIN',
          tenantId: tenant.id,
          gymName: tenant.name,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update Clerk metadata for user ${clerkId}:`, error);
      // Don't fail the operation if Clerk metadata update fails
      // The webhook will eventually sync the data
    }

    return tenant;
  }

  async getUserTenantStatus(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return { hasTenant: false, tenant: null };
    }

    return {
      hasTenant: !!user.tenantId,
      tenant: user.tenant,
    };
  }
}
