import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'last_name'})
  lastName: string;

  @Column({name: 'middle_name'})
  middleName: string;

  static fromRaw(raw: any): Teacher {
    const entity = new Teacher();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.lastName = raw.last_name;
    entity.middleName = raw.middle_name;
    return entity;
  }
}