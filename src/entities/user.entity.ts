import { Column, Entity, PrimaryColumn } from 'typeorm';


export enum UserRole {
  USER, ADMIN
}

@Entity('user')
export class User{
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

  static fromRaw(raw: any): User {
    const entity = new User();
    entity.login = raw.login;
    entity.password = raw.password;
    entity.email = raw.email;
    entity.role = raw.role;
    entity.rating = raw.rating;
    entity.professionId = +raw.profession_id;
    return entity;
  }


}