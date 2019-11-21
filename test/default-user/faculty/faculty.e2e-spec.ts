import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth, testUserAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, FACULTIES, USERS_JWT } from '../../e2e.constants';
import request from 'supertest';

describe('Faculty', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET /faculty', () => {
    testUserAuth(server, RequestMethod.GET, '/faculty');
    it('success: all', () => {
      return request(server)
        .get(`/faculty`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(3);
          expect(response.body.faculty).toEqual([{
            id: FACULTIES.INFORMATICS.id,
            name: FACULTIES.INFORMATICS.name,
            shortName: FACULTIES.INFORMATICS.shortName,
          }, {
            id: FACULTIES.FEN.id,
            name: FACULTIES.FEN.name,
            shortName: FACULTIES.FEN.shortName,
          }, {
            id: FACULTIES.FGN.id,
            name: FACULTIES.FGN.name,
            shortName: FACULTIES.FGN.shortName,
          }]);
        });
    });
    it('success: by id', () => {
      return request(server)
        .get(`/faculty`)
        .query(`facultyId=${FACULTIES.FGN.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.faculty).toEqual([{
            id: FACULTIES.FGN.id,
            name: FACULTIES.FGN.name,
            shortName: FACULTIES.FGN.shortName,
          }]);
        });
    });
    it('success: by search', () => {
      return request(server)
        .get(`/faculty`)
        .query(`search=FG`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.faculty).toEqual([{
            id: FACULTIES.FGN.id,
            name: FACULTIES.FGN.name,
            shortName: FACULTIES.FGN.shortName,
          }]);
        });
    });
  });
});
