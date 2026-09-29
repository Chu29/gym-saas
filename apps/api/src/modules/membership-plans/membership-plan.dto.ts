import { BillingCycle, DurationUnit } from "@repo/database";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class CreateMembershipPlanDto {
  @IsString() @MinLength(2) name: string;
  @IsOptional() @IsString() description?: string;
  @IsInt() @Min(0) priceCents: number;
  @IsInt() @Min(1) durationValue: number;
  @IsEnum(DurationUnit) durationUnit: DurationUnit;
  @IsEnum(BillingCycle) billingCycle: BillingCycle;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsArray() @IsString({ each: true }) perks?: string[];
}

export class UpdateMembershipPlanDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  monthlyTokenAllowance?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;

  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @IsOptional()
  @IsInt()
  @Min(1)
  tokenExpiryDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
