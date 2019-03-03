import { IsOptional, IsString } from 'class-validator';

export class UpdateTeacherAdminDto {
  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  middleName: string;
}