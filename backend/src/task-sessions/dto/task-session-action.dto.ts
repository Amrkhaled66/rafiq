import { IsInt, Min } from 'class-validator';

export class TaskSessionActionDto {
  @IsInt()
  @Min(0)
  elapsedSeconds!: number;
}
