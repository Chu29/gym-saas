import { Module } from '@nestjs/common';
import { MemberController } from './member.controller.js';
import { MemberRepository } from './member.repository.js';
import { MemberService } from './member.service.js';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
})
export class MemberModule {}
