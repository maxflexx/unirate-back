import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, FACULTIES, PROFESSIONS, USERS_JWT } from '../../e2e.constants';
import request from 'supertest';
import { DbUtil } from '../../../src/utils/db-util';
import { Profession } from '../../../src/entities/profession.entity';
import { INVALID_PARAMS, ITEM_ALREADY_EXISTS, ITEM_NOT_FOUND } from '../../../src/constants';


describe('Admin Professions', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/profession', () => {
    testAdminAuth(server, RequestMethod.GET, `/admin/profession`);
    it('success: filter by facultyId', () => {
      return request(server)
        .get(`/admin/profession`)
        .query(`facultyId=${FACULTIES.FEN.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.ECONOMIST.id,
            name: PROFESSIONS.ECONOMIST.name,
            facultyId: PROFESSIONS.ECONOMIST.faculty.id
          }]);
        });
    });
    it('success: filter by professionId', () => {
      return request(server)
        .get(`/admin/profession`)
        .query(`professionId=${PROFESSIONS.ECONOMIST.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.ECONOMIST.id,
            name: PROFESSIONS.ECONOMIST.name,
            facultyId: PROFESSIONS.ECONOMIST.faculty.id
          }]);
        });
    });
    it('success: filter by search', () => {
      return request(server)
        .get(`/admin/profession`)
        .query(`search=erman`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.GERMAN_PHILOLOGY.id,
            name: PROFESSIONS.GERMAN_PHILOLOGY.name,
            facultyId: PROFESSIONS.GERMAN_PHILOLOGY.faculty.id
          }]);
        });
    });
    it('success: all', () => {
      return request(server)
        .get(`/admin/profession`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(4);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.SOFTWARE_DEVELOPMENT.id,
            name: PROFESSIONS.SOFTWARE_DEVELOPMENT.name,
            facultyId: PROFESSIONS.SOFTWARE_DEVELOPMENT.faculty.id
          }, {
            id: PROFESSIONS.GERMAN_PHILOLOGY.id,
            name: PROFESSIONS.GERMAN_PHILOLOGY.name,
            facultyId: PROFESSIONS.GERMAN_PHILOLOGY.faculty.id
          }, {
            id: PROFESSIONS.APPLIED_MATH.id,
            name: PROFESSIONS.APPLIED_MATH.name,
            facultyId: PROFESSIONS.APPLIED_MATH.faculty.id
          }, {
            id: PROFESSIONS.ECONOMIST.id,
            name: PROFESSIONS.ECONOMIST.name,
            facultyId: PROFESSIONS.ECONOMIST.faculty.id
          }]);
        });
    });
  });
  describe('POST admin/profession', () => {
    testAdminAuth(server, RequestMethod.POST, `/admin/profession`);
    it('success', () => {
      const body = {name: 'ewrf', facultyId: FACULTIES.INFORMATICS.id};
      return request(server)
        .post(`/admin/profession`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            name: body.name,
            facultyId: body.facultyId
          });
          const profession = await DbUtil.getProfessionById(Profession, response.body.id);
          expect(profession).toEqual({
            id: response.body.id,
            name: body.name,
            facultyId: body.facultyId
          });
        });
    });
    it('fail: no such faculty', () => {
      const body = {name: 'qwer', facultyId: 9999};
      return request(server)
        .post(`/admin/profession`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: profession with such name already exists', () => {
      const body = {name: PROFESSIONS.APPLIED_MATH.name, facultyId: FACULTIES.FGN.id};
      return request(server)
        .post(`/admin/profession`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CONFLICT)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_ALREADY_EXISTS);
        });
    });
    it('fail: no name', () => {
      const body = {facultyId: FACULTIES.FGN.id};
      return request(server)
        .post(`/admin/profession`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
    it('fail: no faculty id', () => {
      const body = {name: 'eewfs'};
      return request(server)
        .post(`/admin/profession`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
  });
  describe('PUT admin/profession/:id', () => {
    testAdminAuth(server, RequestMethod.PUT, `/admin/profession/1`);
    it('success: update all', () => {
      const body = {name: 'new_name', facultyId: FACULTIES.FGN.id};
      return request(server)
        .put(`/admin/profession/${PROFESSIONS.SOFTWARE_DEVELOPMENT.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: PROFESSIONS.SOFTWARE_DEVELOPMENT.id,
            name: body.name,
            facultyId: body.facultyId
          });
          const profession = await DbUtil.getProfessionById(Profession, response.body.id);
          expect(profession).toEqual({
            id: response.body.id,
            name: body.name,
            facultyId: body.facultyId
          });
        });
    });
    it('success: nothing updated', () => {
      return request(server)
        .put(`/admin/profession/${PROFESSIONS.GERMAN_PHILOLOGY.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: PROFESSIONS.GERMAN_PHILOLOGY.id,
            name: PROFESSIONS.GERMAN_PHILOLOGY.name,
            facultyId: PROFESSIONS.GERMAN_PHILOLOGY.faculty.id
          });
          const profession = await DbUtil.getProfessionById(Profession, response.body.id);
          expect(profession).toEqual({
            id: PROFESSIONS.GERMAN_PHILOLOGY.id,
            name: PROFESSIONS.GERMAN_PHILOLOGY.name,
            facultyId: PROFESSIONS.GERMAN_PHILOLOGY.faculty.id
          });
        });
    });
    it('fail: no such profession', () => {
      return request(server)
        .put(`/admin/profession/99999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: no such faculty', () => {
      const body = {facultyId: 9999};
      return request(server)
        .put(`/admin/profession/${PROFESSIONS.APPLIED_MATH.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: profession with such name already exists', () => {
      const body = {name: PROFESSIONS.APPLIED_MATH.name};
      return request(server)
        .put(`/admin/profession/${PROFESSIONS.GERMAN_PHILOLOGY.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CONFLICT)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_ALREADY_EXISTS);
        });
    });
  });
  describe('DELETE admin/profession', () => {
    testAdminAuth(server, RequestMethod.DELETE, `/admin/profession/1`);
    it('success', () => {
      return request(server)
        .delete(`/admin/profession/${PROFESSIONS.GERMAN_PHILOLOGY.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const profession = await DbUtil.getProfessionById(Profession, PROFESSIONS.GERMAN_PHILOLOGY.id);
          expect(profession).toBe(null);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .delete(`/admin/profession/9999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});