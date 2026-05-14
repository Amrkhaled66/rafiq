import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCoachDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string;
}
