import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupBodyDto {
  @IsString()
  login: string;

  @IsString()
  @Transform(v => v.toString().toLocaleLowerCase())
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  professionId: number;
}