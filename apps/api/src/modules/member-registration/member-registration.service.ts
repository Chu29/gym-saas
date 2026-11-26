import { clerkClient } from '@clerk/express';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@repo/database';
import { RegisterMemberDto } from './member-registration.dto.js';
import { MemberRegistrationRepository } from './member-registration.repository.js';

type InvitationMetadata = { role?: string; tenantId?: string; invitationId?: string };

function clerkMessage(err: unknown): string | undefined {
  const errors = (err as { errors?: { longMessage?: string; message?: string }[] })?.errors;
  return errors?.[0]?.longMessage ?? errors?.[0]?.message;
}

@Injectable()
export class MemberRegistrationService {
  private readonly logger = new Logger(MemberRegistrationService.name);

  constructor(private readonly repo: MemberRegistrationRepository) {}

  async register(tenantId: string, dto: RegisterMemberDto) {
    const email = dto.email.toLowerCase().trim();

    // 1. Verify this email is not already an active user
    if (await this.repo.findUserByEmail(tenantId, email)) {
      throw new ConflictException('This email already belongs to a member of your gym');
    }

    // 2. Check if there is an existing pending invitation for this email
    const pending = await this.repo.findPendingByEmail(tenantId, email);

    if (pending) {
      this.logger.log(
        `Found pending invitation [${pending.id}] for ${email}. Re-sending via Clerk...`,
      );
      const sent = await this.dispatchClerkInvitation(email, tenantId, pending.id);

      // Refresh the database invitation with latest details and new Clerk ID
      return this.repo.touchPendingInvitation(pending.id, { ...dto, email }, sent.id);
    }

    // 3. New invitation: create database record first
    let invitation: Awaited<ReturnType<MemberRegistrationRepository['createInvitation']>>;
    try {
      invitation = await this.repo.createInvitation(tenantId, { ...dto, email });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('An invitation for this email is already pending');
      }
      throw err;
    }

    // 4. Send through Clerk
    try {
      const sent = await this.dispatchClerkInvitation(email, tenantId, invitation.id);
      await this.repo.setClerkInvitationId(invitation.id, sent.id);
    } catch (err) {
      await this.repo.deleteInvitation(invitation.id); // Roll back DB record if email fails
      throw err;
    }

    return invitation;
  }

  private async dispatchClerkInvitation(email: string, tenantId: string, invitationId: string) {
    try {
      const redirectUrl = `${process.env.WEB_URL ?? 'http://localhost:3000'}/sign-up`;
      const sent = await clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl,
        publicMetadata: { role: UserRole.MEMBER, tenantId, invitationId },
        ignoreExisting: true,
      });

      this.logger.log(`Clerk invitation dispatched to ${email} (Clerk ID: ${sent.id})`);
      return sent;
    } catch (err) {
      this.logger.error(`Clerk invitation failed for ${email}:`, clerkMessage(err));
      throw new BadRequestException(clerkMessage(err) ?? 'Could not send the invitation email');
    }
  }

  listPending(tenantId: string) {
    return this.repo.findPending(tenantId);
  }

  /**
   * Called by /post-auth right after the invited person signs up.
   * Reads the invitation details from the Clerk user itself (not the session token),
   * so it works even before the session token has the new metadata.
   */
  async accept(clerkId: string) {
    const existing = await this.repo.findUserByClerkId(clerkId);
    if (existing) {
      if (existing.role !== UserRole.MEMBER) {
        throw new ForbiddenException('This account belongs to gym staff, not a member');
      }
      if (existing.tenantId) {
        await this.syncClerkMetadata(clerkId, existing.tenantId);
      }
      return { user: existing, member: existing.memberProfile };
    }

    const clerkUser = await clerkClient.users.getUser(clerkId);
    const meta = (clerkUser.publicMetadata ?? {}) as InvitationMetadata;
    const verifiedEmails = clerkUser.emailAddresses
      .filter((e) => e.verification?.status === 'verified')
      .map((e) => e.emailAddress.toLowerCase());

    // 1) Normal case: the invitation id came with the Clerk invitation.
    // 2) Fallback: the person already had a Clerk account, so Clerk didn't copy the
    //    invitation details onto it. Find their pending invitation by verified email.
    let invitation =
      meta.tenantId && meta.invitationId
        ? await this.repo.findInvitation(meta.tenantId, meta.invitationId)
        : null;
    if (!invitation) invitation = await this.repo.findPendingByEmails(verifiedEmails);

    if (invitation?.status !== 'PENDING') {
      throw new NotFoundException('Invitation not found or already used');
    }
    if (!verifiedEmails.includes(invitation.email.toLowerCase())) {
      throw new ForbiddenException('This invitation was sent to a different email address');
    }

    let result: Awaited<ReturnType<MemberRegistrationRepository['provisionMember']>>;
    try {
      result = await this.repo.provisionMember(clerkId, invitation);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const user = await this.repo.findUserByClerkId(clerkId); // double submit
        if (user) return { user, member: user.memberProfile };
      }
      throw err;
    }

    await this.syncClerkMetadata(clerkId, invitation.tenantId);
    return result;
  }

  /** Make sure later logins see role MEMBER + the right gym in the session. */
  private async syncClerkMetadata(clerkId: string, tenantId: string) {
    try {
      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: { role: UserRole.MEMBER, tenantId, invitationId: null },
      });
    } catch {
      // Not fatal: the member is created in the database either way.
    }
  }
}
