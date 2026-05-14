import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  USER_DELETED_STATUSES,
  type UserDeletedStatus,
} from '../../users/dto/list-users-query.dto';

export class ListCoachesQueryDto {
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
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(USER_DELETED_STATUSES)
  deletedStatus: UserDeletedStatus = 'active';
}
