import { IsIn, IsInt, IsString, MinLength } from 'class-validator';

export class CreateDisciplineDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  @IsIn([0, 1])
  mandatory: number;

  @IsInt()
  @IsIn([0, 1, 2, 3, 4])
  year: number;

  @IsInt()
  facultyId: number;
}