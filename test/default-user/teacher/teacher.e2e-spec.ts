import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testUserAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, TEACHER, USERS_JWT } from '../../e2e.constants';
import request from 'supertest';
import { INVALID_PARAMS } from '../../../src/constants';

describe('Teachers', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET /teacher', () => {
    testUserAuth(server, RequestMethod.GET, `/teacher`);
    it('success: filter by id', () => {
      return request(server)
        .get(`/teacher`)
        .query(`teacherId=${TEACHER.USHENKO.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.teachers).toEqual([{
            id: TEACHER.USHENKO.id,
            lastName: TEACHER.USHENKO.lastName,
            name: TEACHER.USHENKO.name,
            middleName: TEACHER.USHENKO.middleName,
            feedbackNumber: 1
          }]);
        });
    });
    it('success: filter by search', () => {
      return request(server)
        .get(`/teacher`)
        .query(`search=Ush`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.teachers).toEqual([{
            id: TEACHER.USHENKO.id,
            lastName: TEACHER.USHENKO.lastName,
            name: TEACHER.USHENKO.name,
            middleName: TEACHER.USHENKO.middleName,
            feedbackNumber: 1
          }]);
        });
    });
    it('fail: invalid id', () => {
      return request(server)
        .get(`/teacher`)
        .query(`teacherId=ewrjkg`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
  });
});