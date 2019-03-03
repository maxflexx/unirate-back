import { IsString } from 'class-validator';

export class CreateTecherAdminDto {
  @IsString()
  lastName: string;

  @IsString()
  name: string;

  @IsString()
  middleName: string;
}