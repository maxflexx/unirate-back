import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProfessionDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsInt()
  @IsOptional()
  facultyId: number;
}