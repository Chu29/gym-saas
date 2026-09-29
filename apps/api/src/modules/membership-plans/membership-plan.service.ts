import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@repo/database";
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from "./membership-plan.dto.js";
import { MembershipPlanRepository } from "./membership-plan.repository.js";

@Injectable()
export class MembershipPlanService {
  constructor(private readonly repo: MembershipPlanRepository) {}

  async create(tenantId: string, dto: CreateMembershipPlanDto) {
    try {
      return await this.repo.create(tenantId, dto);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException(`A plan named "${dto.name}" already exists for this gym`);
      }
      throw err;
    }
  }

  findAll(tenantId: string, activeOnly = false) {
    return this.repo.findAll(tenantId, activeOnly);
  }

  async findOne(tenantId: string, id: string) {
    const plan = await this.repo.findOne(tenantId, id);
    if (!plan) throw new NotFoundException("Membership plan not found");
    return plan;
  }

  async update(tenantId: string, id: string, dto: UpdateMembershipPlanDto) {
    const { count } = await this.repo.update(tenantId, id, dto);
    if (count === 0) throw new NotFoundException("Membership plan not found");
    return this.repo.findOne(tenantId, id);
  }

  async deactivate(tenantId: string, id: string) {
    return this.update(tenantId, id, { isActive: false });
  }
}
