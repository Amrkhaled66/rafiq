import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { EGYPT_CITY_ENUM_VALUES } from '../../common/constants';
import { gradeLevelEnum } from '../../db';
import {
  USER_DELETED_STATUSES,
} from '../../users/dto/list-users-query.dto';
import type { UserDeletedStatus } from '../../users/dto/list-users-query.dto';

export class ListStudentsQueryDto {
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
  @IsEnum(gradeLevelEnum.enumValues)
  gradeLevel?: (typeof gradeLevelEnum.enumValues)[number];

  @IsOptional()
  @IsEnum(EGYPT_CITY_ENUM_VALUES)
  city?: (typeof EGYPT_CITY_ENUM_VALUES)[number];

  @IsOptional()
  @IsEnum(USER_DELETED_STATUSES)
  deletedStatus: UserDeletedStatus = 'active';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  coachId?: number;
}
