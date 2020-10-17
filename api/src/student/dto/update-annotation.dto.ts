import { IsString, MinLength } from 'class-validator';

export class UpdateAnnotationDto {
  id: string;

  @IsString()
  @MinLength(1, { message: 'content is too short' })
  content?: string;

  matchId?: string;

  teacherId?: string;
}
