import { IsEnum, IsString, MaxLength } from 'class-validator';
import { SCHOOL_SUBJECT_ENUM_VALUES } from '../../common/constants/subjects';
import { lessonWeekdayEnum } from '../../db';

export class CreateLessonDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsEnum(SCHOOL_SUBJECT_ENUM_VALUES)
  subject!: (typeof SCHOOL_SUBJECT_ENUM_VALUES)[number];

  @IsEnum(lessonWeekdayEnum.enumValues)
  weekday!: (typeof lessonWeekdayEnum.enumValues)[number];
}

