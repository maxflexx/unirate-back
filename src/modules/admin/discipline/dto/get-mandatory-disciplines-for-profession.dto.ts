import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMandatoryDisciplinesForProfessionDto {
  @IsInt()
  @Transform(v => +v)
  professionId: number;
}