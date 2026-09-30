import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { WebhooksController } from './webhooks.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
