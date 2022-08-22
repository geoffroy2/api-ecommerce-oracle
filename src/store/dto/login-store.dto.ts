import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginStoreDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;
}
