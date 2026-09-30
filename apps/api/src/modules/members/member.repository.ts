import { randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { MemberStatus, PrismaClient } from "@repo/database";
import * as bcrypt from "bcrypt";
import { PRISMA_CLIENT } from "../../database/prisma.module.js";
import { CreateMemberDto, UpdateMemberDto } from "./member.dto.js";

@Injectable()
export class MemberRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(tenantId: string, dto: CreateMemberDto) {
    const tempPassword = randomBytes(6).toString("hex");
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const membershipNo = `M-${Date.now().toString(36).toUpperCase()}`;

    // User + MemberProfile must succeed together, or not at all.
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          tenantId,
          email: dto.email,
          passwordHash,
          role: "MEMBER",
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      const member = await tx.memberProfile.create({
        data: {
          tenantId,
          userId: user.id,
          membershipNo,
          planId: dto.planId,
        },
      });

      return { user, member };
    });

    return { ...result, tempPassword }; // service decides what to expose/send
  }

  findAll(tenantId: string, status?: string) {
    return this.prisma.memberProfile.findMany({
      where: {
        tenantId,
        ...(status ? { status: status as MemberStatus } : {}),
      },
      include: { user: true, plan: true },
      orderBy: { joinedAt: "desc" },
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.memberProfile.findFirst({
      where: { id, tenantId },
      include: { user: true, plan: true, wallet: true },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateMemberDto) {
    const member = await this.prisma.memberProfile.findFirst({
      where: { id, tenantId },
    });
    if (!member) return null;

    const { firstName, lastName, ...memberFields } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (firstName || lastName) {
        await tx.user.update({
          where: { id: member.userId },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
          },
        });
      }
      return tx.memberProfile.update({
        where: { id },
        data: memberFields,
        include: { user: true, plan: true },
      });
    });
  }

  async setStatus(tenantId: string, id: string, status: "ACTIVE" | "FROZEN" | "CANCELLED") {
    const { count } = await this.prisma.memberProfile.updateMany({
      where: { id, tenantId },
      data: { status },
    });
    return count > 0;
  }
}
