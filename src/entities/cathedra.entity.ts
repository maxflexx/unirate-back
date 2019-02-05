import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cathedra')
export class CathedraEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'faculty_id'})
  facultyId: number;

  static fromRaw(raw: any): CathedraEntity {
    const entity = new CathedraEntity();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.facultyId = +raw.faculty_id;
    return entity;
  }


}