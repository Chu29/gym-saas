import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'; // Adjust path to your PrismaService
import { CreateSaasPlanDto } from './dto/create-saas-plan.dto.js';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto.js';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get Platform Dashboard Metrics
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

  async createSaasPlan(dto: CreateSaasPlanDto) {
    return this.prisma.saasPlan.create({
      data: { ...dto, maxMembers: dto.maxMembers ?? 100, maxStaff: dto.maxStaff ?? 2 },
    });
  }
}
