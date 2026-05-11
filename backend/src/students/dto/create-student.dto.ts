import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EGYPT_CITY_ENUM_VALUES } from '../../common/constants';
import { gradeLevelEnum } from '../../db';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phone!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;

  @IsEnum(EGYPT_CITY_ENUM_VALUES)
  city!: (typeof EGYPT_CITY_ENUM_VALUES)[number];

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  parentPhone!: string;

  @IsEnum(gradeLevelEnum.enumValues)
  gradeLevel!: (typeof gradeLevelEnum.enumValues)[number];
}
