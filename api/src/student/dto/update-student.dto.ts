import { MaxLength, MinLength } from 'class-validator';
import { Annotation } from 'src/annotation/schema/annotation.schema';

export class UpdateStudentDto {
  id?: string;

  @MinLength(1, { message: 'name must have at least one character' })
  @MaxLength(50, { message: 'name is too long' })
  name: string;

  status: string;
}
