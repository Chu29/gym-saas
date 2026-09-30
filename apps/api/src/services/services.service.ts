import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PrismaClient } from '@repo/database';
import { PRISMA } from '../prisma/prisma.module.js';
import type { CreateServiceDto } from './dto/create-service.dto.js';
import type { ListServicesQueryDto } from './dto/list-services-query.dto.js';
import type { UpdateServiceDto } from './dto/update-service.dto.js';

const isUniqueViolation = (e: unknown) =>
  typeof e === 'object' && e !== null && (e as { code?: string }).code === 'P2002';

const DUPLICATE = 'A service with this name already exists';

@Injectable()
export class ServicesService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  // Every method takes tenantId from the authenticated user, never from input.

  list(tenantId: string, query: ListServicesQueryDto) {
    return this.prisma.service.findMany({
      where: {
        tenantId,
        ...(query.isActive !== undefined && { isActive: query.isActive }),
        ...(query.category && { category: query.category }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateServiceDto) {
    try {
      return await this.prisma.service.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (isUniqueViolation(e)) throw new ConflictException(DUPLICATE);
      throw e;
    }
  }

  async update(tenantId: string, id: string, dto: UpdateServiceDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields to update');
    }
    let count: number;
    try {
      ({ count } = await this.prisma.service.updateMany({
        where: { id, tenantId },
        data: dto,
      }));
    } catch (e) {
      if (isUniqueViolation(e)) throw new ConflictException(DUPLICATE);
      throw e;
    }
    // 404 (not 403) for other tenants' services so ids can't be probed.
    if (count === 0) throw new NotFoundException('Service not found');
    const updated = await this.prisma.service.findFirst({ where: { id, tenantId } });
    if (!updated) throw new NotFoundException('Service not found');
    return updated;
  }
}
