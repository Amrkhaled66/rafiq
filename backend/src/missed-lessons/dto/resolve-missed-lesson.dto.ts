import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResolveMissedLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  note!: string;
}
