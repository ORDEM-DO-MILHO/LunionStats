import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  id?: string;

  @MinLength(1, { message: 'name must have at least one character' })
  @MaxLength(50, { message: 'name is too long' })
  email: string;

  @IsNotEmpty()
  password: string;

  role: string;
}
