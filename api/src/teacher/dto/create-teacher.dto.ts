import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @MinLength(1, { message: 'name is too short' })
  @MaxLength(50, { message: 'name is too long' })
  name: string;

  @MinLength(1, { message: 'summoner is too short' })
  @MaxLength(100, { message: 'summoner is too long' })
  summoner: string;

  @IsEmail()
  @MinLength(1, { message: 'email is too short' })
  @MaxLength(100, { message: 'email is too long' })
  email: string;

  @MinLength(1, { message: 'password is too short' })
  @MaxLength(100, { message: 'password is too long' })
  password: string;

  @MinLength(1, { message: 'email is too short' })
  @MaxLength(100, { message: 'email is too long' })
  status: string;
}
