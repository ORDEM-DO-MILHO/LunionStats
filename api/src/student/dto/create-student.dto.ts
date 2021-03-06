import { MaxLength, MinLength } from 'class-validator';

export class CreateStudentDto {
  @MinLength(3, { message: 'name must have more than 3 characters' })
  @MaxLength(50, { message: 'name must have no more than 50 characters' })
  name: string;

  user?: any;

  status?: any;
}
