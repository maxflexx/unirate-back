import { Column, Entity, PrimaryColumn } from 'typeorm';


export enum UserRole {
  USER, ADMIN
}

@Entity('user')
export class User {
  @PrimaryColumn()
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: number;

  @Column()
  rating: number;

  @Column({name: 'profession_id'})
  professionId: number;
}