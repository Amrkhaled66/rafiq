import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { userRoleEnum } from '../../db';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string;

  @IsOptional()
  @IsEnum(userRoleEnum.enumValues)
  role?: (typeof userRoleEnum.enumValues)[number];
}
