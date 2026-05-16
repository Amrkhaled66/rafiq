import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResolveMissedTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  note!: string;
}
