import { MemberStatus } from "@repo/database";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class CreateMemberDto {
  @IsString() @MinLength(2) firstName: string;
  @IsString() @MinLength(2) lastName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() planId?: string;
}

export class UpdateMemberDto {
  @IsOptional() @IsString() @MinLength(2) firstName?: string;
  @IsOptional() @IsString() @MinLength(2) lastName?: string;
  @IsOptional() @IsString() planId?: string;
  @IsOptional() @IsEnum(MemberStatus) status?: MemberStatus;
}
