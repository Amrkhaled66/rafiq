import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export const DAILY_TASK_PROGRESS_SORT_FIELDS = [
  'studentName',
  'totalTasks',
  'completedTasks',
  'missedTasks',
] as const;

export type DailyTaskProgressStatus = 'finished' | 'unfinished';
export type DailyTaskProgressSort =
  (typeof DAILY_TASK_PROGRESS_SORT_FIELDS)[number];
export type DailyTaskProgressSortOrder = 'asc' | 'desc';

export class ListDailyTaskProgressQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsOptional()
  @IsIn(['finished', 'unfinished'])
  status: DailyTaskProgressStatus = 'unfinished';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsIn(DAILY_TASK_PROGRESS_SORT_FIELDS)
  sortBy: DailyTaskProgressSort = 'missedTasks';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: DailyTaskProgressSortOrder = 'desc';
}
