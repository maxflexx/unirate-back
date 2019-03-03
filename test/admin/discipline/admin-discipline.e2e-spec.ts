import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, FACULTIES, PROFESSIONS } from '../../e2e.constants';
import request from 'supertest';
import { DbUtil } from '../../../src/utils/db-util';
import { Discipline } from '../../../src/entities/discipline.entity';
import { INVALID_PARAMS, ITEM_NOT_FOUND } from '../../../src/constants';

describe('Admin Disciplines', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/discipline', () => {
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
        .get(`/admin/discipline`)
        .query(`facultyId=${FACULTIES.FEN.id}&year=${DISCIPLINE.HISTORY.year}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.disciplines).toEqual([ {
            id: DISCIPLINE.HISTORY.id,
            name: DISCIPLINE.HISTORY.name,
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
            year: DISCIPLINE.PROCEDURE.year,
            facultyId: DISCIPLINE.PROCEDURE.faculty.id
          }]);
        });
    });
    it('success: profession mandatory', () => {
      return request(server)
        .get(`/admin/discipline`)
        .query(`mandatoryProfessionId=${PROFESSIONS.ECONOMIST.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(2);
          expect(response.body.disciplines).toEqual([ {
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
  describe('POST admin/discipline', () => {
    testAdminAuth(server, RequestMethod.POST, '/admin/discipline');
    it('success', () => {
      const body = {name: 'NEW_DISCIPLINE', year: 3, facultyId: FACULTIES.FEN.id};
      return request(server)
        .post('/admin/discipline')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            name: body.name,
            year: body.year,
            facultyId: body.facultyId
          });
          const discipline = await DbUtil.getDisciplineById(Discipline, response.body.id);
          expect(discipline).toEqual({
            id: response.body.id,
            name: body.name,
            year: body.year,
            facultyId: body.facultyId
          });
        });
    });
    it('fail: faculty not found', () => {
      const body = {name: 'NEW_DISCIPLINE', year: 3, facultyId: 90999};
      return request(server)
        .post('/admin/discipline')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then( response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: no name', () => {
      const body = {year: 3, facultyId: FACULTIES.INFORMATICS.id};
      return request(server)
        .post('/admin/discipline')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then( response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
  });
  describe('PUT admin/discipline/:id', () => {
    testAdminAuth(server, RequestMethod.PUT, '/admin/discipline/1');
    it('success: update everything', () => {
      const body = {name: 'UPDATE', year: 1, facultyId: FACULTIES.FGN.id};
      return request(server)
        .put(`/admin/discipline/${DISCIPLINE.PROCEDURE.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: DISCIPLINE.PROCEDURE.id,
            name: body.name,
            year: body.year,
            facultyId: body.facultyId,
          });
          const discipline = await DbUtil.getDisciplineById(Discipline, response.body.id);
          expect(discipline).toEqual({
            id: response.body.id,
            name: body.name,
            year: body.year,
            facultyId: body.facultyId
          });
        });
    });
    it('success: partial update', () => {
      const body = { year: 2};
      return request(server)
        .put(`/admin/discipline/${DISCIPLINE.OBDZ.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: DISCIPLINE.OBDZ.id,
            name: DISCIPLINE.OBDZ.name,
            year: body.year,
            facultyId: DISCIPLINE.OBDZ.faculty.id,
          });
          const discipline = await DbUtil.getDisciplineById(Discipline, response.body.id);
          expect(discipline).toEqual({
            id: DISCIPLINE.OBDZ.id,
            name: DISCIPLINE.OBDZ.name,
            year: body.year,
            facultyId: DISCIPLINE.OBDZ.faculty.id,
          });
        });
    });
    it('fail: faculty not found', () => {
      const body = {facultyId: 90999};
      return request(server)
        .put(`/admin/discipline/${DISCIPLINE.HISTORY.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then( response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: discipline not found', () => {
      const body = {facultyId: FACULTIES.FEN.id};
      return request(server)
        .put(`/admin/discipline/9999`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then( response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('DELETE admin/discipline/:id', () => {
    it('success', () => {
      return request(server)
        .delete(`/admin/discipline/${DISCIPLINE.OOP.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then( async response => {
          const discipline = await DbUtil.getDisciplineById(Discipline, DISCIPLINE.OOP.id);
          expect(discipline).toBe(null);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .delete(`/admin/discipline/99999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then( async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});