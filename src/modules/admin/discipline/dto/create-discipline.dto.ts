import { IsIn, IsInt, IsString, MinLength } from 'class-validator';

export class CreateDisciplineDto {
  @IsString()
  name: string;

  @IsInt()
  @IsIn([0, 1, 2, 3, 4])
  year: number;

  @IsInt()
  facultyId: number;
}