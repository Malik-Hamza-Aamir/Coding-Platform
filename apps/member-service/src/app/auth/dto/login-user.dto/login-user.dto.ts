import {
  IsString,
  IsEmail,
  MinLength,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';

export class LoginUserDto {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString()
  @IsDefined()
  @MinLength(8)
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
