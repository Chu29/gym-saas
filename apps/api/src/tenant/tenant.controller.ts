import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard.js';
import { CurrentClerkUser } from '../auth/decorators/auth-user.decorator.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { TenantService } from './tenant.service.js';

@Controller('tenants')
@UseGuards(ClerkAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('onboard')
  async onboardGym(@CurrentClerkUser() user: { clerkId: string }, @Body() dto: CreateTenantDto) {
    return this.tenantService.createGymTenant(user.clerkId, dto);
  }

  @Get('status')
  async getOnboardingStatus(@CurrentClerkUser() user: { clerkId: string }) {
    return this.tenantService.getUserTenantStatus(user.clerkId);
  }
}
