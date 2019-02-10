import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTeacherParamsDto {
  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @IsOptional()
  teacherId: number;
}