import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ProfessionClientDto {
  id: number;

  name: string;

  facultyName: string;

  static fromRaw(raw: any): ProfessionClientDto {
    const entity = new ProfessionClientDto();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.facultyName = raw.facultyName;
    return entity;
  }
}