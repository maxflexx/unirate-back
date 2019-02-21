import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProfessionDto {
  @IsInt()
  @Transform(item => +item || item)
  @IsOptional()
  facultyId: number;
}