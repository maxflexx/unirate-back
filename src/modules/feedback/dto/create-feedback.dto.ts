import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @IsOptional()
  studentGrade: number;

  @IsString()
  comment: string;

  @IsInt({each: true})
  @MinLength(1)
  teachersIds: number[];
}