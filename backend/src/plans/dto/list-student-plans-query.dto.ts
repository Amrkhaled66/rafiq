import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export const STUDENT_PLAN_STATUSES = ['active', 'upcoming', 'ended'] as const;

export type StudentPlanStatus = (typeof STUDENT_PLAN_STATUSES)[number];

export class ListStudentPlansQueryDto {
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
  @IsIn(STUDENT_PLAN_STATUSES)
  status?: StudentPlanStatus;
}
