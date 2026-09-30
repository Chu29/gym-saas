import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { PRISMA_CLIENT } from '../../database/prisma.module.js';
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from './membership-plan.dto.js';

@Injectable()
export class MembershipPlanRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  create(tenantId: string, dto: CreateMembershipPlanDto) {
    return this.prisma.subscriptionPlan.create({ data: { ...dto, tenantId } });
  }

  findAll(tenantId: string, activeOnly = false) {
    return this.prisma.subscriptionPlan.findMany({
      where: { tenantId, ...(activeOnly ? { isActive: true } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.subscriptionPlan.findFirst({ where: { id, tenantId } });
  }

  update(tenantId: string, id: string, dto: UpdateMembershipPlanDto) {
    return this.prisma.subscriptionPlan.updateMany({ where: { id, tenantId }, data: dto });
  }

  deactivate(tenantId: string, id: string) {
    return this.update(tenantId, id, { isActive: false });
  }
}
