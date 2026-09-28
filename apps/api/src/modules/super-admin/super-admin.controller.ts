import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateSaasPlanDto } from './dto/create-saas-plan.dto.js';
import { UpdateTenantStatusDto } from './dto/update-tenant-status.dto.js';
import { SuperAdminGuard } from './guards/super-admin.guard.js';
import { SuperAdminService } from './super-admin.service.js';

@Controller('super-admin')
@UseGuards(SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  getDashboardStats() {
    return this.superAdminService.getDashboardStats();
  }

  @Get('tenants')
  getAllTenants() {
    return this.superAdminService.getAllTenants();
  }

  @Patch('tenants/:id')
  updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantStatusDto) {
    return this.superAdminService.updateTenant(id, dto);
  }

  @Get('plans')
  getAllSaasPlans() {
    return this.superAdminService.getAllSaasPlans();
  }

  @Post('plans')
  createSaasPlan(@Body() dto: CreateSaasPlanDto) {
    return this.superAdminService.createSaasPlan(dto);
  }
}
