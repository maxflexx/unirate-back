import * as fs from 'fs';
import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import { ORM_CONFIG_MEMORY, UNAUTHORIZED } from '../src/constants';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import * as bodyParser from 'body-parser';
import {
  ADMINS_JWT,
  DISCIPLINE,
  FACULTIES, FEEDBACK_GRADE,
  FEEDBACK_TEACHER,
  FEEDBACKS,
  INVALID_JWT, MANDATORY,
  PROFESSIONS,
  TEACHER,
  USERS,
  USERS_JWT
} from './e2e.constants';
import { AuthModule } from '../src/modules/auth/auth.module';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import request from 'supertest';
import { UserModule } from '../src/modules/default-user/user/user.module';
import { DbUtil } from '../src/utils/db-util';
import { FeedbackModule } from '../src/modules/default-user/feedback/feedback.module';
import { TeacherModule } from '../src/modules/default-user/teacher/teacher.module';
import { AdminFeedbackModule } from '../src/modules/admin/feedback/admin-feedback.module';
import { AdminDisciplineModule } from '../src/modules/admin/discipline/admin-discipline.module';
import { AdminFacultyModule } from '../src/modules/admin/faculty/admin-faculty.module';
import { AdminProfessionModule } from '../src/modules/admin/profession/admin-profession.module';

export async function initTestApp(server) {
  const ORM_CONFIG = ORM_CONFIG_MEMORY;

  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(ORM_CONFIG), AppModule, AuthModule, UserModule, FeedbackModule, TeacherModule, AdminFeedbackModule, AdminDisciplineModule, AdminFacultyModule, AdminProfessionModule]
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

  for (const key in FACULTIES) {
    FACULTIES[key].id = +(await DbUtil.insertOne(`INSERT INTO faculty (id, name, short_name) VALUES (${FACULTIES[key].id}, "${FACULTIES[key].name}", "${FACULTIES[key].shortName}");`));
  }

  for (const key in PROFESSIONS) {
    PROFESSIONS[key].id = +(await DbUtil.insertOne(`INSERT INTO profession (id, name, faculty_id) VALUES (${PROFESSIONS[key].id}, "${PROFESSIONS[key].name}", ${PROFESSIONS[key].faculty.id})`));
  }

  for (const key in USERS) {
    if (USERS[key].profession)
      await DbUtil.insertOne(`INSERT INTO user (login, password, email, role, rating, profession_id) VALUES ("${USERS[key].login}", "${USERS[key].password}", "${USERS[key].email}", ${USERS[key].role}, ${USERS[key].rating}, ${USERS[key].profession.id})`);
    else
      await DbUtil.insertOne(`INSERT INTO user (login, password, email, role, rating) VALUES ("${USERS[key].login}", "${USERS[key].password}", "${USERS[key].email}", ${USERS[key].role}, ${USERS[key].rating})`);
  }

  for (const key in DISCIPLINE) {
    await DbUtil.insertOne(`INSERT INTO discipline (id, name, year, faculty_id) VALUES (${DISCIPLINE[key].id}, "${DISCIPLINE[key].name}", ${DISCIPLINE[key].year}, ${DISCIPLINE[key].faculty.id});`);
  }

  for (const key in TEACHER) {
    await DbUtil.insertOne(`INSERT INTO teacher (id, name, last_name, middle_name) VALUES (${TEACHER[key].id}, "${TEACHER[key].name}", "${TEACHER[key].lastName}", "${TEACHER[key].middleName}");`);
  }

  for (const key in FEEDBACKS) {
    await DbUtil.insertOne(`INSERT INTO feedback (id, student_grade, rating, comment, created, updated, user_login, discipline_id) VALUES (${FEEDBACKS[key].id}, ${FEEDBACKS[key].studentGrade || null}, ${FEEDBACKS[key].rating}, "${FEEDBACKS[key].comment}", ${FEEDBACKS[key].created}, ${FEEDBACKS[key].updated || 0}, "${FEEDBACKS[key].user.login}", ${FEEDBACKS[key].discipline.id});`);
  }

  for (const key in FEEDBACK_TEACHER) {
    await DbUtil.insertOne(`INSERT INTO feedback_teacher (feedback_id, teacher_id) VALUES (${FEEDBACK_TEACHER[key].feedback.id}, ${FEEDBACK_TEACHER[key].teacher.id});`);
  }

  for (const key in FEEDBACK_GRADE) {
    await DbUtil.insertOne(`INSERT INTO feedback_grade (id, like, feedback_id, user_login) VALUES (${FEEDBACK_GRADE[key].id}, ${FEEDBACK_GRADE[key].like}, ${FEEDBACK_GRADE[key].feedback.id}, "${FEEDBACK_GRADE[key].user.login}");`);
  }

  for (const key in MANDATORY) {
    await DbUtil.insertOne(`INSERT INTO mandatory (discipline_id, profession_id) VALUES (${MANDATORY[key].discipline.id}, ${MANDATORY[key].profession.id});`);
  }

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
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('no jwt', () => {
    return doRequest(server, requestMethod, url)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid secret jwt word', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_JWT_SECRET_WORD)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid invalid jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('admin cannot enter', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
}

export function testAdminAuth(server, requestMethod: RequestMethod, url: string) {
  it('invalid login jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_LOGIN_JWT)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('no jwt', () => {
    return doRequest(server, requestMethod, url)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid secret jwt word', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_JWT_SECRET_WORD)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('invalid invalid jwt', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + INVALID_JWT.INVALID_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
  it('user cannot enter', () => {
    return doRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(response => {
        expect(response.body.error).toBe(UNAUTHORIZED);
      });
  });
}