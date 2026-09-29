import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import type { AuthUser } from '../auth/auth-user.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { ListServicesQueryDto } from './dto/list-services-query.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { ServicesService } from './services.service.js';

const OBJECT_ID = /^[0-9a-f]{24}$/i;

@Controller('services')
@UseGuards(AuthGuard, RolesGuard)
@Roles('GYM_ADMIN')
export class ServicesController {
  constructor(@Inject(ServicesService) private readonly services: ServicesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListServicesQueryDto) {
    return this.services.list(user.tenantId, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateServiceDto) {
    return this.services.create(user.tenantId, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateServiceDto) {
    // Malformed ids would make Prisma/Mongo throw; treat them as not found.
    if (!OBJECT_ID.test(id)) throw new NotFoundException('Service not found');
    return this.services.update(user.tenantId, id, dto);
  }
}
