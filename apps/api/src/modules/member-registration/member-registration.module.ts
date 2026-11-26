import { Module } from '@nestjs/common';
import { MemberRegistrationController } from './member-registration.controller.js';
import { MemberRegistrationRepository } from './member-registration.repository.js';
import { MemberRegistrationService } from './member-registration.service.js';

@Module({
  controllers: [MemberRegistrationController],
  providers: [MemberRegistrationService, MemberRegistrationRepository],
})
export class MemberRegistrationModule {}
