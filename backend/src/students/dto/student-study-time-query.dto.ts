import { IsDefined, Matches } from 'class-validator';

export class StudentStudyTimeQueryDto {
  @IsDefined()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  from!: string;

  @IsDefined()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  to!: string;
}
