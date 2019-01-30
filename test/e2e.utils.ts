import * as fs from "fs";
import {ValidationPipe} from '../src/common/pipes/validation.pipe';
import {ORM_CONFIG_MEMORY} from '../src/constants';
import {Test} from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import {AppModule} from '../src/app.module';
import * as bodyParser from 'body-parser';
import { User } from '../src/modules/entities/user.entity';
import { FACULTIES, PROFESSIONS, USERS } from './e2e.constants';
import { Faculty } from '../src/modules/entities/faculty.entity';
import { Profession } from '../src/modules/entities/profession.entity';


export async function initTestApp(server) {
  const ORM_CONFIG = ORM_CONFIG_MEMORY;

  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(ORM_CONFIG), AppModule],
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