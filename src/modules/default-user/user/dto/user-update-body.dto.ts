import { IsEmail, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserUpdateBodyDto {
  @IsString()
  @IsEmail()
  @Transform(v => v.toString().toLocaleLowerCase())
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