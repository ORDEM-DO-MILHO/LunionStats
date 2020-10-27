import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAnnotationDto {
  id: string;

  @IsString()
  @MinLength(1, { message: 'content is too short' })
  @MaxLength(50, { message: 'content is too long' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'content is too short' })
  content: string;

  matchId: bigint;

  teacherId: string;

  studentId: string;

  rating: number;
}
