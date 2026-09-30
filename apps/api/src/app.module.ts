import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ServicesModule } from './services/services.module.js';
import { TenantController } from './tenant/tenant.controller.js';
import { TenantService } from './tenant/tenant.service.js';
import { WebhooksModule } from './webhooks/webhooks.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ServicesModule, WebhooksModule],
  controllers: [AppController, TenantController],
  providers: [AppService, TenantService],
})
export class AppModule {}
