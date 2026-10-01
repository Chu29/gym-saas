import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@repo/database';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard.js';
import { TenantId } from '../../auth/decorators/auth-user.decorator.js';
import { Roles } from '../../auth/roles.decorator.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from './membership-plan.dto.js';
import { MembershipPlanService } from './membership-plan.service.js';

@Controller('membership-plans')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class MembershipPlanController {
  constructor(private readonly service: MembershipPlanService) {}

  @Post()
  @Roles(UserRole.GYM_ADMIN)
  create(@TenantId() tenantId: string, @Body() dto: CreateMembershipPlanDto) {
    return this.service.create(tenantId, dto);
  }

  @Get()
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK, UserRole.TRAINER, UserRole.MEMBER)
  findAll(@TenantId() tenantId: string, @Query('activeOnly') activeOnly?: string) {
    return this.service.findAll(tenantId, activeOnly === 'true');
  }

  @Get(':id')
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK, UserRole.TRAINER, UserRole.MEMBER)
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(UserRole.GYM_ADMIN)
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMembershipPlanDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.GYM_ADMIN)
  deactivate(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.deactivate(tenantId, id);
  }
}
