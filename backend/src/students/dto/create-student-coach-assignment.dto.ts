import { IsInt, Min } from 'class-validator';

export class CreateStudentCoachAssignmentDto {
  @IsInt()
  @Min(1)
  coachId!: number;
}

