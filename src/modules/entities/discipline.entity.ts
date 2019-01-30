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

  @Column({name: 'cathedra_id'})
  cathedraId: number;
}