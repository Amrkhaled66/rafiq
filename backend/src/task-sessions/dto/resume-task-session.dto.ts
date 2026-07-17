import { IsISO8601 } from 'class-validator';

export class ResumeTaskSessionDto {
  @IsISO8601({ strict: true })
  expectedEndAt!: string;
}
