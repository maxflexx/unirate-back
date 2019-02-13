import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @IsOptional()
  studentGrade: number;

  @IsString()
  comment: string;

  @IsInt({each: true})
  @IsNotEmpty()
  teachersIds: number[];
}