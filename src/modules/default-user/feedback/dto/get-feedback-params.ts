import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFeedbackParamsDto {
  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @IsOptional()
  disciplineId: number;

  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @IsOptional()
  facultyId: number;
}