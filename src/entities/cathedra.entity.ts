import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cathedra')
export class CathedraEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'faculty_id'})
  facultyId: number;
}