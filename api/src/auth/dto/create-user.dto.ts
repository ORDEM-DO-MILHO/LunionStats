import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MinLength(1, { message: 'email is too short' })
  @MaxLength(100, { message: 'email is too long' })
  email: string;

  @MinLength(1, { message: 'password is too short' })
  @MaxLength(100, { message: 'password is too long' })
  password: string;

  role?: string;
}
