import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  CreateStudentPlanDto,
  CreateStudentPlanTaskDto,
} from './create-student-plan.dto';

export class UpdateStudentPlanTaskDto extends CreateStudentPlanTaskDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;
}

export class UpdateStudentPlanDto extends CreateStudentPlanDto {
  @IsArray()
  @ArrayMaxSize(300)
  @ValidateNested({ each: true })
  @Type(() => UpdateStudentPlanTaskDto)
  declare tasks: UpdateStudentPlanTaskDto[];
}
