import { IsEmail, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class UserUpdateBodyDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  professionId: number;
}