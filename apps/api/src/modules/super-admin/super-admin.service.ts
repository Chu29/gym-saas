import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto.js';

@Injectable()
export class SuperAdminService {
  async updatePlan(id: string, dto: UpdatePlanDto) {
    const plan = await this.prisma.saasPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (dto.code) {
      const existingPlan = await this.prisma.saasPlan.findFirst({
        where: {
          code: dto.code.trim().toUpperCase(),
          NOT: { id },
        },
      });

      if (existingPlan) {
        throw new ConflictException(`Plan with code "${dto.code}" already exists`);
      }
    }

    return this.prisma.saasPlan.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && {
          code: dto.code.trim().toUpperCase(),
        }),
        ...(dto.priceCents !== undefined && {
          priceCents: dto.priceCents,
        }),
        ...(dto.currency !== undefined && {
          currency: dto.currency,
        }),
        ...(dto.maxMembers !== undefined && {
          maxMembers: dto.maxMembers,
        }),
        ...(dto.maxStaff !== undefined && {
          maxStaff: dto.maxStaff,
        }),
        ...(dto.stripePriceId !== undefined && {
          stripePriceId: dto.stripePriceId,
        }),
        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },
    });
  }
  constructor(private readonly prisma: PrismaService) {}

  // 1. Platform Dashboard Metrics
  async getDashboardStats() {
    const [totalTenants, totalMembers, activePlans, activeTenants] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.memberProfile.count(),
      this.prisma.saasPlan.count({ where: { isActive: true } }),
      this.prisma.tenant.count({ where: { status: 'ACTIVE' } }),
    ]);

    return {
      totalTenants,
      totalMembers,
      activePlans,
      activeTenants,
    };
  }

  // 2. Tenant Management
  async getAllTenants() {
    return this.prisma.tenant.findMany({
      include: {
        saasPlan: true,
        _count: { select: { members: true, users: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTenant(tenantId: string, dto: UpdateTenantStatusDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (dto.saasPlanId) {
      const plan = await this.prisma.saasPlan.findUnique({
        where: { id: dto.saasPlanId },
      });
      if (!plan) throw new NotFoundException('Plan not found');
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.saasPlanId !== undefined && { saasPlanId: dto.saasPlanId }),
      },
    });
  }

  // 3. SaaS Plan Management
  async getAllSaasPlans() {
    return this.prisma.saasPlan.findMany({
      orderBy: { priceCents: 'asc' },
    });
  }

  async createPlan(dto: CreatePlanDto) {
    const code = dto.code
      ? dto.code.trim().toUpperCase()
      : dto.name.trim().toUpperCase().replace(/\s+/g, '_');

    if (!code) {
      throw new BadRequestException('Plan name is required');
    }

    const existingPlan = await this.prisma.saasPlan.findUnique({
      where: { code },
    });

    if (existingPlan) {
      throw new ConflictException(`Plan with code "${code}" already exists`);
    }

    return this.prisma.saasPlan.create({
      data: {
        name: dto.name,
        code,
        priceCents: dto.priceCents,
        currency: dto.currency ?? 'USD',
        maxMembers: dto.maxMembers,
        maxStaff: dto.maxStaff ?? 0,
        ...(dto.stripePriceId && {
          stripePriceId: dto.stripePriceId,
        }),
        isActive: dto.isActive ?? true,
      },
    });
  }
  async deletePlan(id: string) {
    const plan = await this.prisma.saasPlan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const tenantsOnPlan = await this.prisma.tenant.count({
      where: { saasPlanId: id },
    });
    if (tenantsOnPlan > 0) {
      throw new ConflictException(
        `Cannot delete plan "${plan.name}": ${tenantsOnPlan} tenant(s) are currently subscribed to it. Reassign them to a different plan first.`,
      );
    }

    return this.prisma.saasPlan.delete({ where: { id } });
  }
}
