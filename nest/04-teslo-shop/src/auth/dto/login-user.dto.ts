import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { userPasswordDef } from '../user-password-def.pattern';

const { pattern, message } = userPasswordDef;

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(pattern, { message })
  password: string;
}
