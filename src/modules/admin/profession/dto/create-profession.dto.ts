import { IsInt, IsString } from 'class-validator';

export class CreateProfessionDto {
  @IsString()
  name: string;

  @IsInt()
  facultyId: number;
}