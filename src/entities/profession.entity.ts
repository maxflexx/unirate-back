import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profession')
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'faculty_id'})
  facultyId: number;

  static fromRaw(raw: any): Profession {
    const entity = new Profession();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.facultyId = +raw.faculty_id;
    return entity;
  }
}