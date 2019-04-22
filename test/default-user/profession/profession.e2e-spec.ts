import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth, testUserAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, FACULTIES, PROFESSIONS, USERS_JWT } from '../../e2e.constants';
import request from 'supertest';

describe('Professions', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET /profession', () => {
    testUserAuth(server, RequestMethod.GET, `/profession`);
    it('success: filter by facultyId', () => {
      return request(server)
        .get(`/profession`)
        .query(`facultyId=${FACULTIES.FEN.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.ECONOMIST.id,
            name: PROFESSIONS.ECONOMIST.name,
            facultyName: PROFESSIONS.ECONOMIST.faculty.name
          }]);
        });
    });
    it('success: filter by professionId', () => {
      return request(server)
        .get(`/profession`)
        .query(`professionId=${PROFESSIONS.ECONOMIST.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.ECONOMIST.id,
            name: PROFESSIONS.ECONOMIST.name,
            facultyName: PROFESSIONS.ECONOMIST.faculty.name
          }]);
        });
    });
    it('success: filter by search', () => {
      return request(server)
        .get(`/profession`)
        .query(`search=erman`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.GERMAN_PHILOLOGY.id,
            name: PROFESSIONS.GERMAN_PHILOLOGY.name,
            facultyName: PROFESSIONS.GERMAN_PHILOLOGY.faculty.name
          }]);
        });
    });
  });
});