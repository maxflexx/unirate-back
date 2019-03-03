import { IsInt } from 'class-validator';

export class CreateAdminMandatoryDto {

  @IsInt()
  disciplineId: number;

  @IsInt()
  professionId: number;
}