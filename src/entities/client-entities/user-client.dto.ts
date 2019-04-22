import { Column, PrimaryColumn } from 'typeorm';

export class UserClientDto {
  login: string;

  password: string;

  email: string;

  role: number;

  professionName: string;

  static fromRaw(raw: any): UserClientDto {
    const entity = new UserClientDto();
    entity.login = raw.login;
    entity.password = raw.password;
    entity.email = raw.email;
    entity.role = raw.role;
    entity.professionName = raw.professionName;
    return entity;
  }
}