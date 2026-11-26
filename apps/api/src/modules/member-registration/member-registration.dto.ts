import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterMemberDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  planId?: string;
}
