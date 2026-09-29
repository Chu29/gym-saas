import { Module } from "@nestjs/common";
import { MembershipPlanController } from "./membership-plan.controller.js";
import { MembershipPlanRepository } from "./membership-plan.repository.js";
import { MembershipPlanService } from "./membership-plan.service.js";

@Module({
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService, MembershipPlanRepository],
  exports: [MembershipPlanService],
})
export class MembershipPlanModule {}
