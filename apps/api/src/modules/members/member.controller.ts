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
} from "@nestjs/common";
import { UserRole } from "@repo/database";
import { ClerkAuthGuard } from "../../auth/clerk-auth.guard.js";
import { TenantId } from "../../auth/decorators/auth-user.decorator.js";
import { Roles } from "../../auth/roles.decorator.js";
import { RolesGuard } from "../../auth/roles.guard.js";
import { CreateMemberDto, UpdateMemberDto } from "./member.dto.js";
import { MemberService } from "./member.service.js";

@Controller("members")
@UseGuards(ClerkAuthGuard, RolesGuard)
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Post()
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK)
  create(@TenantId() tenantId: string, @Body() dto: CreateMemberDto) {
    return this.service.create(tenantId, dto);
  }

  @Get()
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK, UserRole.TRAINER)
  findAll(@TenantId() tenantId: string, @Query("status") status?: string) {
    return this.service.findAll(tenantId, status);
  }

  @Get(":id")
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK, UserRole.TRAINER)
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(":id")
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK)
  update(@TenantId() tenantId: string, @Param("id") id: string, @Body() dto: UpdateMemberDto) {
    return this.service.update(tenantId, id, dto);
  }

  @Patch(":id/freeze")
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK)
  freeze(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.service.freeze(tenantId, id);
  }

  @Patch(":id/reactivate")
  @Roles(UserRole.GYM_ADMIN, UserRole.FRONT_DESK)
  reactivate(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.service.reactivate(tenantId, id);
  }

  @Delete(":id")
  @Roles(UserRole.GYM_ADMIN)
  deactivate(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.service.deactivate(tenantId, id);
  }
}
