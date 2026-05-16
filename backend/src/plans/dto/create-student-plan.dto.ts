import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SCHOOL_SUBJECT_ENUM_VALUES } from '../../common/constants/subjects';

export class CreateStudentPlanTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsEnum(SCHOOL_SUBJECT_ENUM_VALUES)
  subject!: (typeof SCHOOL_SUBJECT_ENUM_VALUES)[number];

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dueOn!: string; // YYYY-MM-DD
}

export class CreateStudentPlanDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startsOn!: string; // YYYY-MM-DD

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endsOn!: string; // YYYY-MM-DD

  @IsOptional()
  @IsInt()
  coachId?: number;

  @IsArray()
  @ArrayMaxSize(300)
  @ValidateNested({ each: true })
  @Type(() => CreateStudentPlanTaskDto)
  tasks!: CreateStudentPlanTaskDto[];
}
