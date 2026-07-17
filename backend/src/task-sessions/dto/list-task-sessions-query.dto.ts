import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

const SESSION_STATUS_VALUES = [
  'running',
  'paused',
  'completed',
  'cancelled',
] as const;

export class ListTaskSessionsQueryDto {
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
  limit: number = 10;

  @IsOptional()
  studentPhone?: string;

  @IsOptional()
  @IsIn(SESSION_STATUS_VALUES)
  status?: (typeof SESSION_STATUS_VALUES)[number];

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  from?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  to?: string;
}
