import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { userRoleEnum } from '../../db';

export const USER_DELETED_STATUSES = ['active', 'deleted', 'all'] as const;
export type UserDeletedStatus = (typeof USER_DELETED_STATUSES)[number];

export class ListUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsEnum(userRoleEnum.enumValues)
  role?: (typeof userRoleEnum.enumValues)[number];

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(USER_DELETED_STATUSES)
  deletedStatus: UserDeletedStatus = 'active';
}
