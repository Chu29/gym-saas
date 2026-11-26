import { IsDateString, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMemberDetailsDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergencyContactName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  emergencyContactPhone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;

  @IsOptional()
  @IsMongoId()
  planId?: string | null;

  @IsOptional()
  @IsDateString()
  membershipStartsAt?: string | null;

  @IsOptional()
  @IsDateString()
  membershipEndsAt?: string | null;
}

export class CreateMemberCheckInDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
