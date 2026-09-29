import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
// import { UserRole } from '@repo/database';
// import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
// import { RolesGuard } from '../../shared/guards/roles.guard.js';
// import { Roles } from '../../shared/decorators/roles.decorator.js';
import type { AuthenticatedRequest } from "../../shared/types/authenticated-request.js";
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from "./membership-plan.dto.js";
import { MembershipPlanService } from "./membership-plan.service.js";

// TEMP: fake tenantId for manual testing before auth exists — remove when re-enabling guards
const TEMP_TENANT_ID = "000000000000000000000001";

@Controller("membership-plans")
// TEMP: guards disabled for manual testing — re-enable once auth module provides req.user
// @UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipPlanController {
  constructor(private readonly service: MembershipPlanService) {}

  @Post()
  // @Roles(UserRole.GYM_ADMIN)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateMembershipPlanDto) {
    return this.service.create(TEMP_TENANT_ID, dto);
    // return this.service.create(req.user.tenantId, dto);
  }

  @Get()
  // @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK, UserRole.TRAINER, UserRole.MEMBER)
  findAll(@Req() req: AuthenticatedRequest, @Query("activeOnly") activeOnly?: string) {
    return this.service.findAll(TEMP_TENANT_ID, activeOnly === "true");
    // return this.service.findAll(req.user.tenantId, activeOnly === 'true');
  }

  @Get(":id")
  // @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK, UserRole.TRAINER, UserRole.MEMBER)
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.service.findOne(TEMP_TENANT_ID, id);
    // return this.service.findOne(req.user.tenantId, id);
  }

  @Patch(":id")
  // @Roles(UserRole.GYM_ADMIN)
  update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateMembershipPlanDto,
  ) {
    return this.service.update(TEMP_TENANT_ID, id, dto);
    // return this.service.update(req.user.tenantId, id, dto);
  }

  @Delete(":id")
  // @Roles(UserRole.GYM_ADMIN)
  deactivate(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.service.deactivate(TEMP_TENANT_ID, id);
    // return this.service.deactivate(req.user.tenantId, id);
  }
}
