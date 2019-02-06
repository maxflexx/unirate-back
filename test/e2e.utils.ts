import * as fs from 'fs';
import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import { ORM_CONFIG_MEMORY, UNAUTHORIZED } from '../src/constants';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import * as bodyParser from 'body-parser';
import { User } from '../src/entities/user.entity';
import { ADMINS_JWT, FACULTIES, INVALID_JWT, PROFESSIONS, USERS, USERS_JWT } from './e2e.constants';
import { Faculty } from '../src/entities/faculty.entity';
import { Profession } from '../src/entities/profession.entity';
import { AuthModule } from '../src/modules/auth/auth.module';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import request from 'supertest';
import { UserModule } from '../src/modules/user/user.module';

export async function initTestApp(server) {
  const ORM_CONFIG = ORM_CONFIG_MEMORY;

  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(ORM_CONFIG), AppModule, AuthModule, UserModule],
  }).compile();

  server.use(bodyParser.json());
  server.use(bodyParser.raw());
  server.use(bodyParser.text());

  const app = module.createNestApplication(server);
  app.useGlobalPipes(new ValidationPipe());

  const scripts = [
    // 'triggers-sqlite.sql'
  ];

  await app.init();

  const connection = await getConnection(ORM_CONFIG.name);

  scripts.forEach(async element => {
    const content = String((fs as any).readFileSync(__dirname + '/../scripts/' + element));
    const statements = content.split('END;');
    if (statements.length === 1) {
      await connection.query(content);
    } else {
      statements.forEach(async statement => {
        const trimmed = statement.trim();
        if (trimmed.length > 0) {
          await connection.query(trimmed + 'END;');
        }
      });
    }
  });

  return connection;
}


export async function createTestData() {
  const db: Connection = await getConnection(ORM_CONFIG_MEMORY.name);

  const facultyRep = db.getRepository(Faculty);
  for (const key in FACULTIES) {
    FACULTIES[key].id = +(await createFacultyData(facultyRep, FACULTIES[key])).id;
  }

  const professionRep = db.getRepository(Profession);
  for (const key in PROFESSIONS) {
    PROFESSIONS[key].id = +(await createProfessionData(professionRep, PROFESSIONS[key])).id;
  }

  const userRep = db.getRepository(User);
  for (const key in USERS) {
    await createUserData(userRep, USERS[key]);
  }
}

export async function createFacultyData(facultyRep: Repository<Faculty>, raw: any): Promise<Faculty> {
 const faculty = Object.assign(new Faculty(), raw);
 return await facultyRep.save(faculty);
}

export async function createProfessionData(professionRep: Repository<Profession>, raw: any): Promise<Profession> {
  const profession = Object.assign(new Profession(), raw);
  if (raw.faculty) {
    profession.facultyId = raw.faculty.id;
  }
  return await professionRep.save(profession);
}

export async function createUserData(userRep: Repository<User>, raw: any): Promise<User> {
  const user = Object.assign(new User(), raw);
  if (raw.profession) {
    user.professionId = raw.profession.id;
  }
  return await userRep.save(user);
}


export function doRequest(server, requestMethod: RequestMethod, url: string) {
  if (requestMethod === RequestMethod.GET)
    return request(server).get(url);
  if (requestMethod === RequestMethod.POST)
    return request(server).post(url);
  if (requestMethod === RequestMethod.PUT)
    return request(server).put(url);
  if (requestMethod === RequestMethod.DELETE)
    return request(server).delete(url);
  expect(0).toBe(1);
}

export function testUserAuth(server, requestMethod: RequestMethod, url: string) {
  it('invalid login jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_LOGIN_JWT)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('no jwt', () => {
    return doRequest(server, requestMethod, url)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid secret jwt word', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_JWT_SECRET_WORD)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid invalid jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('admin cannot enter', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
}

export function testAdminAuth(server, requestMethod: RequestMethod, url: string) {
  it('invalid login jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_LOGIN_JWT)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('no jwt', () => {
    return doRequest(server, requestMethod, url)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid secret jwt word', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_JWT_SECRET_WORD)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid invalid jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });
  it('admin cannot enter', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.error).toBe(UNAUTHORIZED);
      });
  });

}