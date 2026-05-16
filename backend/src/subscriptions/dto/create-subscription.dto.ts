import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  studentPhone!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  packageId!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startsAt!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  amountPaid!: number;
}
