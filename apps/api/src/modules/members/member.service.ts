import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { CreateMemberDto, UpdateMemberDto } from './member.dto.js';
import { MemberRepository } from './member.repository.js';

@Injectable()
export class MemberService {
  constructor(private readonly repo: MemberRepository) {}

  async create(tenantId: string, dto: CreateMemberDto) {
    try {
      const result = await this.repo.create(tenantId, dto);
      // TODO: send tempPassword via an invite email instead of returning it once email is wired up
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('A user with this email already exists');
      }
      throw err;
    }
  }

  findAll(tenantId: string, status?: string) {
    return this.repo.findAll(tenantId, status);
  }

  async findOne(tenantId: string, id: string) {
    const member = await this.repo.findOne(tenantId, id);
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async update(tenantId: string, id: string, dto: UpdateMemberDto) {
    const member = await this.repo.update(tenantId, id, dto);
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async deactivate(tenantId: string, id: string) {
    const ok = await this.repo.setStatus(tenantId, id, 'CANCELLED');
    if (!ok) throw new NotFoundException('Member not found');
  }

  async freeze(tenantId: string, id: string) {
    const ok = await this.repo.setStatus(tenantId, id, 'FROZEN');
    if (!ok) throw new NotFoundException('Member not found');
  }

  async reactivate(tenantId: string, id: string) {
    const ok = await this.repo.setStatus(tenantId, id, 'ACTIVE');
    if (!ok) throw new NotFoundException('Member not found');
  }
}
