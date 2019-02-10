import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testUserAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { DISCIPLINE, TEACHER, USERS_JWT } from '../../e2e.constants';
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
  describe('GET feedback/:disciplineId', () => {
    testUserAuth(server, RequestMethod.GET, `/teacher`);
    it('success', () => {
      return request(server)
        .get(`/teacher`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.length).toBe(5);
          expect(response.body).toContainEqual({
            id: TEACHER.GULAEVA.id,
            name: TEACHER.GULAEVA.name,
            lastName: TEACHER.GULAEVA.lastName,
            middleName: TEACHER.GULAEVA.middleName,
          });
        });
    });
    it('success: by id', () => {
      return request(server)
        .get(`/teacher`)
        .query(`teacherId=${TEACHER.GULAEVA.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body).toEqual([{
            id: TEACHER.GULAEVA.id,
            name: TEACHER.GULAEVA.name,
            lastName: TEACHER.GULAEVA.lastName,
            middleName: TEACHER.GULAEVA.middleName,
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