import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { EGYPT_CITY_ENUM_VALUES } from '../../common/constants';
import { gradeLevelEnum } from '../../db';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @IsOptional()
  @IsEnum(EGYPT_CITY_ENUM_VALUES)
  city?: (typeof EGYPT_CITY_ENUM_VALUES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(32)
  parentPhone?: string;

  @IsOptional()
  @IsEnum(gradeLevelEnum.enumValues)
  gradeLevel?: (typeof gradeLevelEnum.enumValues)[number];

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string;
}
