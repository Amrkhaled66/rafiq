import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export const EXPIRING_SUBSCRIPTION_DAY_WINDOWS = [3, 7, 14, 30] as const;

export type ExpiringSubscriptionDays =
  (typeof EXPIRING_SUBSCRIPTION_DAY_WINDOWS)[number];

export class ListExpiringSubscriptionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn(EXPIRING_SUBSCRIPTION_DAY_WINDOWS)
  days: ExpiringSubscriptionDays = 7;

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
}
