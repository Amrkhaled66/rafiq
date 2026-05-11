import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
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
  @IsEnum(userRoleEnum.enumValues)
  role?: (typeof userRoleEnum.enumValues)[number];
}
