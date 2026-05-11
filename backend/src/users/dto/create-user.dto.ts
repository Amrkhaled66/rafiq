import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { userRoleEnum } from '../../db';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phone!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;

  @IsEnum(userRoleEnum.enumValues)
  role!: (typeof userRoleEnum.enumValues)[number];
}
