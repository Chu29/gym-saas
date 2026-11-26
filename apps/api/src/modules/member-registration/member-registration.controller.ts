import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@repo/database';
import { ClerkSessionGuard, ClerkSessionUserId } from '../../auth/clerk.session.guard.js';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard.js';
import { TenantId } from '../../auth/decorators/auth-user.decorator.js';
import { Roles } from '../../auth/roles.decorator.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { RegisterMemberDto } from './member-registration.dto.js';
import { MemberRegistrationService } from './member-registration.service.js';

@Controller('member-registrations')
export class MemberRegistrationController {
  constructor(private readonly service: MemberRegistrationService) {}

  // Staff only: send an invitation email
  @Post()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK)
  register(@TenantId() tenantId: string, @Body() dto: RegisterMemberDto) {
    return this.service.register(tenantId, dto);
  }

  // Staff only: list invitations that haven't been accepted yet
  @Get()
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK)
  listPending(@TenantId() tenantId: string) {
    return this.service.listPending(tenantId);
  }

  // The invited person, right after sign-up. They have no database user yet,
  // so this must NOT use ClerkAuthGuard / RolesGuard (those look up the DB user).
  @Post('accept')
  @HttpCode(200)
  @UseGuards(ClerkSessionGuard)
  accept(@ClerkSessionUserId() clerkId: string) {
    return this.service.accept(clerkId);
  }
}
