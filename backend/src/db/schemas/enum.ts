import { pgEnum } from 'drizzle-orm/pg-core';
import {
  EGYPT_CITY_ENUM_VALUES,
  SCHOOL_SUBJECT_ENUM_VALUES,
} from '../../common/constants';

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'coach',
  'super_admin',
]);

export const gradeLevelEnum = pgEnum('grade_level', [
  'first_sec',
  'second_sec',
  'third_sec',
]);

export const egyptCityEnum = pgEnum('egypt_city', EGYPT_CITY_ENUM_VALUES);

export const schoolSubjectEnum = pgEnum(
  'school_subject',
  SCHOOL_SUBJECT_ENUM_VALUES,
);

export const taskStatusEnum = pgEnum('task_status', [
  'pending',
  'in_progress',
  'done',
  'missed',
]);

export const sessionStatusEnum = pgEnum('session_status', [
  'running',
  'paused',
  'completed',
  'cancelled',
]);

export const lessonWeekdayEnum = pgEnum('lesson_weekday', [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
]);
