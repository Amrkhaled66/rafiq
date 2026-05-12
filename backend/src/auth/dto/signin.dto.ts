import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phone!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;
}
