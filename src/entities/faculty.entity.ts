import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faculty')
export class Faculty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'short_name'})
  shortName: string;
}