import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateSubscriptionPackageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number;
}
