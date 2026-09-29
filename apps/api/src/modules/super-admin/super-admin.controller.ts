import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto.js';
import { SuperAdminService } from './super-admin.service.js';

@Controller('super-admin')
// @UseGuards(SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  // 1. Dashboard Stats
  @Get('stats')
  getDashboardStats() {
    return this.superAdminService.getDashboardStats();
  }

  // 2. Tenants Management
  @Get('tenants')
  getAllTenants() {
    return this.superAdminService.getAllTenants();
  }

  @Patch('tenants/:tenantId')
  async updateTenant(@Param('tenantId') tenantId: string, @Body() dto: UpdateTenantStatusDto) {
    return this.superAdminService.updateTenant(tenantId, dto);
  }

  // 3. SaaS Plans Management
  @Get('plans')
  getAllSaasPlans() {
    return this.superAdminService.getAllSaasPlans();
  }

  @Post('plans')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.superAdminService.createPlan(dto);
  }

  @Patch('plans/:id')
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.superAdminService.updatePlan(id, dto);
  }

  @Delete('plans/:id')
  deletePlan(@Param('id') id: string) {
    return this.superAdminService.deletePlan(id);
  }
}
