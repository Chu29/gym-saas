import { Global, Module } from '@nestjs/common';
import { prisma } from '@repo/database';
import { PrismaService } from './prisma.service.js';

export const PRISMA = Symbol('PRISMA');

@Global()
@Module({
  providers: [{ provide: PRISMA, useValue: prisma }, PrismaService],
  exports: [PRISMA, PrismaService],
})
export class PrismaModule {}
