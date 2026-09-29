import { TenantStatus } from '@repo/database';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTenantStatusDto {
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @IsOptional()
  @IsString()
  saasPlanId?: string;
}
