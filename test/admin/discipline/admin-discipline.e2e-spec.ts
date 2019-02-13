import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, FACULTIES } from '../../e2e.constants';
import request from 'supertest';


describe('Admin Disciplines', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/feedback/:disciplineId', () => {
    testAdminAuth(server, RequestMethod.GET, `/admin/discipline`);
    it('success: filter by facultyId', () => {
      return request(server)
        .get(`/admin/discipline`)
        .query(`facultyId=${FACULTIES.FEN.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(2);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.ECONOMICS.id,
            name: DISCIPLINE.ECONOMICS.name,
            mandatory: DISCIPLINE.ECONOMICS.mandatory,
            year: DISCIPLINE.ECONOMICS.year,
            facultyId: FACULTIES.FEN.id
          }, {
            id: DISCIPLINE.HISTORY.id,
            name: DISCIPLINE.HISTORY.name,
            mandatory: DISCIPLINE.HISTORY.mandatory,
            year: DISCIPLINE.HISTORY.year,
            facultyId: FACULTIES.FEN.id
          }]);
        });
    });
    it('success: filter by facultyId & year', () => {
      return request(server)
        .get(`/admin/discipline`)
        .query(`facultyId=${FACULTIES.FEN.id}&year=${DISCIPLINE.HISTORY.year}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.disciplines).toEqual([ {
            id: DISCIPLINE.HISTORY.id,
            name: DISCIPLINE.HISTORY.name,
            mandatory: DISCIPLINE.HISTORY.mandatory,
            year: DISCIPLINE.HISTORY.year,
            facultyId: FACULTIES.FEN.id
          }]);
        });
    });
    it('success: limit & offset', () => {
      return request(server)
        .get(`/admin/discipline`)
        .query(`offset=1&limit=1`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(8);
          expect(response.body.disciplines).toEqual([ {
            id: DISCIPLINE.PROCEDURE.id,
            name: DISCIPLINE.PROCEDURE.name,
            mandatory: DISCIPLINE.PROCEDURE.mandatory,
            year: DISCIPLINE.PROCEDURE.year,
            facultyId: DISCIPLINE.PROCEDURE.faculty.id
          }]);
        });
    });
    it('success: filter by id', () => {
      return request(server)
        .get(`/admin/discipline`)
        .query(`id=${DISCIPLINE.PROCEDURE.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.disciplines).toEqual([ {
            id: DISCIPLINE.PROCEDURE.id,
            name: DISCIPLINE.PROCEDURE.name,
            mandatory: DISCIPLINE.PROCEDURE.mandatory,
            year: DISCIPLINE.PROCEDURE.year,
            facultyId: DISCIPLINE.PROCEDURE.faculty.id
          }]);
        });
    });
  });
});