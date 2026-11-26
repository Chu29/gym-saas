import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { PRISMA_CLIENT } from '../../database/prisma.module.js';
import { RegisterMemberDto } from './member-registration.dto.js';

type PendingInvitation = {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  planId: string | null;
};

@Injectable()
export class MemberRegistrationRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  findUserByEmail(tenantId: string, email: string) {
    return this.prisma.user.findFirst({ where: { tenantId, email } });
  }

  findUserByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
      include: { memberProfile: true },
    });
  }

  findPendingByEmail(tenantId: string, email: string) {
    return this.prisma.memberInvitation.findFirst({
      where: { tenantId, email, status: 'PENDING' },
    });
  }

  createInvitation(tenantId: string, dto: RegisterMemberDto) {
    return this.prisma.memberInvitation.create({
      data: {
        tenantId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        planId: dto.planId,
      },
    });
  }

  touchPendingInvitation(id: string, dto: RegisterMemberDto, clerkInvitationId: string) {
    return this.prisma.memberInvitation.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        planId: dto.planId,
        clerkInvitationId,
        invitedAt: new Date(),
      },
    });
  }

  setClerkInvitationId(id: string, clerkInvitationId: string) {
    return this.prisma.memberInvitation.update({
      where: { id },
      data: { clerkInvitationId },
    });
  }

  deleteInvitation(id: string) {
    return this.prisma.memberInvitation.delete({ where: { id } });
  }

  findPending(tenantId: string) {
    return this.prisma.memberInvitation.findMany({
      where: { tenantId, status: 'PENDING' },
      orderBy: { invitedAt: 'desc' },
    });
  }

  findInvitation(tenantId: string, id: string) {
    return this.prisma.memberInvitation.findFirst({ where: { id, tenantId } });
  }

  /** Newest pending invitation sent to any of these emails. */
  findPendingByEmails(emails: string[]) {
    if (emails.length === 0) return Promise.resolve(null);
    return this.prisma.memberInvitation.findFirst({
      where: { email: { in: emails }, status: 'PENDING' },
      orderBy: { invitedAt: 'desc' },
    });
  }

  provisionMember(clerkId: string, inv: PendingInvitation) {
    const membershipNo = `M-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          clerkId,
          tenantId: inv.tenantId,
          email: inv.email,
          role: 'MEMBER',
          firstName: inv.firstName,
          lastName: inv.lastName,
        },
      });
      const member = await tx.memberProfile.create({
        data: {
          tenantId: inv.tenantId,
          userId: user.id,
          membershipNo,
          planId: inv.planId,
        },
      });
      await tx.memberInvitation.update({
        where: { id: inv.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });
      return { user, member };
    });
  }
}
