import { IsDate, IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  id?: string;

  @IsEmail()
  @MinLength(1, { message: 'email is too short' })
  @MaxLength(100, { message: 'email is too long' })
  email: string;

  @MinLength(1, { message: 'password is too short' })
  @MaxLength(100, { message: 'password is too long' })
  password: string;

  @MinLength(3, { message: 'summoner must have more than 3 characters' })
  @MaxLength(50, { message: 'summoner must have no more than 50 characters' })
  summoner: string;

  @IsDate()
  birthday?: Date;

  socials: any;

  role?: string;
}
