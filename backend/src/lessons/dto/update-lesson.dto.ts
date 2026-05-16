import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { SCHOOL_SUBJECT_ENUM_VALUES } from '../../common/constants/subjects';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEnum(SCHOOL_SUBJECT_ENUM_VALUES)
  subject?: (typeof SCHOOL_SUBJECT_ENUM_VALUES)[number];

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  scheduledAt?: string;
}

