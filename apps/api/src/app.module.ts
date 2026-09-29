import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SuperAdminModule } from './modules/super-admin/super-admin.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // 1. ObserveModule configuration
    // ObserveModule.forRoot({
    //   appKey: process.env.OBSERVE_APP_KEY || 'YOUR_APP_KEY',
    //   appSecret: process.env.OBSERVE_APP_SECRET || 'YOUR_APP_SECRET',
    //   serviceId: 'api',
    // }),

    // 2. NestJS Feature Modules go directly in the imports array:
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
