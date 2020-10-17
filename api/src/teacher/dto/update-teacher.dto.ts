import { MaxLength, MinLength } from 'class-validator';

export class UpdateTeacherDto {
  id?: string;

  @MinLength(1, { message: 'name must have at least one character' })
  @MaxLength(50, { message: 'name is too long' })
  name: string;

  @MinLength(1, { message: 'summoner must have at least one character' })
  @MaxLength(50, { message: 'summoner is too long' })
  summoner: string;

  status: string;
}
