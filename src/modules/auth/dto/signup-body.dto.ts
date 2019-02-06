import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class SignupBodyDto {
  @IsString()
  login: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  professionId: number;
}