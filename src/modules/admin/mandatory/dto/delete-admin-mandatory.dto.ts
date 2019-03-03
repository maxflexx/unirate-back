import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteAdminMandatoryDto {
  @IsInt()
  @Transform(item => item ? +item : item)
  @IsOptional()
  professionId: any;

  @IsInt()
  @Transform(item => item ? +item : item)
  @IsOptional()
  disciplineId: any;
}