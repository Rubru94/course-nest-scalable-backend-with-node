import { IsString, MinLength } from 'class-validator';

export class CreateCarDto {
  @IsString({ message: `Brand must be a cool string` }) // --> custom message
  readonly brand: string;

  @IsString()
  // @Matches(/[a-zA-Z0-9_-]{2,20}/) // --> RegExp
  @MinLength(2 /* , { message: `Minlength` } */)
  readonly model: string;
}
