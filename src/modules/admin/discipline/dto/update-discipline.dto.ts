import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateDisciplineDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsInt()
  @IsIn([1, 2, 3, 4])
  @IsOptional()
  year: number;

  @IsInt()
  @IsOptional()
  facultyId: number;
}