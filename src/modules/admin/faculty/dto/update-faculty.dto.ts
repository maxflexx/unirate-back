import { IsOptional, IsString } from 'class-validator';

export class UpdateFacultyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  shortName: string;
}