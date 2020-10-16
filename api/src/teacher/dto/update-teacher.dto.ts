import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateTeacherDto {
  id?: string;

  @IsOptional()
  @MinLength(1, { message: 'name must have at least one character' })
  @MaxLength(50, { message: 'name is too long' })
  name: string;

  @IsOptional()
  @MinLength(1, { message: 'summoner must have at least one character' })
  @MaxLength(50, { message: 'summoner is too long' })
  summoner: string;

  @IsEmail()
  @IsOptional()
  @MinLength(1, { message: 'email must have at least one character' })
  @MaxLength(50, { message: 'email is too long' })
  email: string;

  @IsOptional()
  @MinLength(6, { message: 'password must have at least one character' })
  password: string;

  @IsOptional()
  status: string;
}
