import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { userPasswordDef } from '../user-password-def.pattern';
import { ApiProperty } from '@nestjs/swagger';

const { pattern, message } = userPasswordDef;

export class CreateUserDto {
  @ApiProperty({
    example: 'test1@mail.com',
    description: 'User email',
    pattern: 'email',
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Abc123',
    description: 'User password',
    minLength: 6,
    maxLength: 50,
    pattern: `${pattern} (must have a Uppercase, lowercase letter and a number)`,
    nullable: false,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(pattern, { message })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    minLength: 1,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
