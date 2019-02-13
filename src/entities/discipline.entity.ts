import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discipline')
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mandatory: number;

  @Column()
  year: number;

  @Column({name: 'faculty_id'})
  facultyId: number;

  static fromRaw(raw: any): Discipline {
    const entity = new Discipline();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.mandatory = raw.mandatory;
    entity.year = raw.year;
    entity.facultyId = +raw.faculty_id;
    return entity;
  }
}