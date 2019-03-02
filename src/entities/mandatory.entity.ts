import { Entity, PrimaryColumn } from 'typeorm';

@Entity('mandatory')
export class Mandatory {
  @PrimaryColumn({name: 'discipline_id'})
  disciplineId: number;

  @PrimaryColumn({name: 'profession_id'})
  professionId: number;

  static fromRaw(raw: any): Mandatory {
    const entity = new Mandatory();
    entity.disciplineId = +raw.discipline_id;
    entity.professionId = +raw.profession_id;
    return entity;
  }
}