import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testUserAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, FACULTIES, PROFESSIONS, USERS_JWT } from '../../e2e.constants';
import request from 'supertest';

describe('Disciplines', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET /discipline', () => {
    testUserAuth(server, RequestMethod.GET, `/discipline`);
    it('success: filter by facultyId', () => {
      return request(server)
        .get(`/discipline`)
        .query(`facultyId=${FACULTIES.FEN.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(2);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.ECONOMICS.id,
            name: DISCIPLINE.ECONOMICS.name,
            year: DISCIPLINE.ECONOMICS.year,
            facultyId: FACULTIES.FEN.id
          }, {
            id: DISCIPLINE.HISTORY.id,
            name: DISCIPLINE.HISTORY.name,
            year: DISCIPLINE.HISTORY.year,
            facultyId: FACULTIES.FEN.id
          }]);
        });
    });
    it('success: filter by facultyId & year', () => {
      return request(server)
        .get(`/discipline`)
        .query(`facultyId=${FACULTIES.FEN.id}&year=${DISCIPLINE.HISTORY.year}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.HISTORY.id,
            name: DISCIPLINE.HISTORY.name,
            year: DISCIPLINE.HISTORY.year,
            facultyId: FACULTIES.FEN.id
          }]);
        });
    });
    it('success: limit & offset', () => {
      return request(server)
        .get(`/discipline`)
        .query(`offset=1&limit=1`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(8);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.PROCEDURE.id,
            name: DISCIPLINE.PROCEDURE.name,
            year: DISCIPLINE.PROCEDURE.year,
            facultyId: DISCIPLINE.PROCEDURE.faculty.id
          }]);
        });
    });
    it('success: filter by id', () => {
      return request(server)
        .get(`/discipline`)
        .query(`id=${DISCIPLINE.PROCEDURE.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.PROCEDURE.id,
            name: DISCIPLINE.PROCEDURE.name,
            year: DISCIPLINE.PROCEDURE.year,
            facultyId: DISCIPLINE.PROCEDURE.faculty.id
          }]);
        });
    });
    it('success: filter by search', () => {
      return request(server)
        .get(`/discipline`)
        .query(`search=OO`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.OOP.id,
            name: DISCIPLINE.OOP.name,
            year: DISCIPLINE.OOP.year,
            facultyId: DISCIPLINE.OOP.faculty.id
          }]);
        });
    });
    it('success: profession mandatory', () => {
      return request(server)
        .get(`/discipline`)
        .query(`mandatoryProfessionId=${PROFESSIONS.ECONOMIST.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(2);
          expect(response.body.disciplines).toEqual([{
            id: DISCIPLINE.ECONOMICS.id,
            name: DISCIPLINE.ECONOMICS.name,
            year: DISCIPLINE.ECONOMICS.year,
            facultyId: DISCIPLINE.ECONOMICS.faculty.id
          }, {
            id: DISCIPLINE.ENGLISH.id,
            name: DISCIPLINE.ENGLISH.name,
            year: DISCIPLINE.ENGLISH.year,
            facultyId: DISCIPLINE.ENGLISH.faculty.id
          }]);
        });
    });
  });
});