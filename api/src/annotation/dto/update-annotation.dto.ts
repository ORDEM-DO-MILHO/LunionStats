import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAnnotationDto {
  id: string;

  @IsString()
  @MinLength(1, { message: 'content is too short' })
  @MaxLength(50, { message: 'content is too long' })
  title?: string;

  @IsString()
  @MinLength(1, { message: 'content is too short' })
  content?: string;

  matchId?: string;

  teacherId?: string;
}
