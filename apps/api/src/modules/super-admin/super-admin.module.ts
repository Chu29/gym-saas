import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js'; // Adjust import to your PrismaModule
import { SuperAdminController } from './super-admin.controller.js';
import { SuperAdminService } from './super-admin.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
