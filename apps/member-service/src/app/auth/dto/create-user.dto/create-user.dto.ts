import {
  IsString,
  IsEmail,
  MinLength,
  IsDefined,
  IsOptional,
  Matches,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsDefined()
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString()
  @IsDefined()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character',
    }
  )
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsString()
  @IsOptional()
  imgURL?: string;

  @IsDefined()
  @IsDateString()
  @IsNotEmpty({ message: 'DOB cannot be empty' })
  dob: string;

  constructor(
    username: string,
    email: string,
    password: string,
    imgURL: string,
    dob: string
  ) {
    this.dob = dob;
    this.username = username;
    this.email = email;
    this.password = password;
    this.imgURL = imgURL;
  }
}
