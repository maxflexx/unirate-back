import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profession')
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'faculty_id'})
  facultyId: number;
}