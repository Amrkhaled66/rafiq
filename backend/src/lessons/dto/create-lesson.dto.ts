import { IsEnum, IsString, Matches, MaxLength } from 'class-validator';
import { SCHOOL_SUBJECT_ENUM_VALUES } from '../../common/constants/subjects';

export class CreateLessonDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsEnum(SCHOOL_SUBJECT_ENUM_VALUES)
  subject!: (typeof SCHOOL_SUBJECT_ENUM_VALUES)[number];

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  scheduledAt!: string;
}

