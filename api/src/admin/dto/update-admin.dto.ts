import { MaxLength, MinLength } from 'class-validator';

export class UpdateAdminDto {
  id?: string;

  @MinLength(1, { message: 'name must have at least one character' })
  @MaxLength(50, { message: 'name is too long' })
  name: string;

  status: string;
}
