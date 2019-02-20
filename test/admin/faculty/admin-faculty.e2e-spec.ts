import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { ADMINS_JWT, FACULTIES } from '../../e2e.constants';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import request from 'supertest';
import { DbUtil } from '../../../src/utils/db-util';
import { Faculty } from '../../../src/entities/faculty.entity';
import { INVALID_PARAMS, ITEM_ALREADY_EXISTS, ITEM_NOT_FOUND } from '../../../src/constants';

describe('Admin Faculty', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/faculty', () => {
    testAdminAuth(server, RequestMethod.GET, '/admin/faculty');
    it('success: all', () => {
      return request(server)
        .get(`/admin/faculty`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(3);
          expect(response.body.faculties).toEqual([{
            id: FACULTIES.INFORMATICS.id,
            name: FACULTIES.INFORMATICS.name,
            shortName: FACULTIES.INFORMATICS.shortName,
          }, {
            id: FACULTIES.FGN.id,
            name: FACULTIES.FGN.name,
            shortName: FACULTIES.FGN.shortName,
          }, {
            id: FACULTIES.FEN.id,
            name: FACULTIES.FEN.name,
            shortName: FACULTIES.FEN.shortName,
          }]);
        });
    });
  });
  describe('POST admin/faculty', () => {
    testAdminAuth(server, RequestMethod.POST, '/admin/faculty');
    it('success', () => {
      const body = {name: 'ergeds', shortName: 'dqw'};
      return request(server)
        .post('/admin/faculty')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            name: body.name,
            shortName: body.shortName
          });
          const faculty = await DbUtil.getFacultyById(Faculty, response.body.id);
          expect(faculty).toEqual({
            id: response.body.id,
            name: body.name,
            shortName: body.shortName
          });
        });
    });
    it('fail: no name', () => {
      const body = {shortName: 'dqw'};
      return request(server)
        .post('/admin/faculty')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
    it('fail: no short name', () => {
      const body = {name: 'dqw'};
      return request(server)
        .post('/admin/faculty')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
    it('fail: there is already faculty with such shortName', () => {
      const body = {name: 'dfsg', shortName: FACULTIES.FEN.shortName};
      return request(server)
        .post('/admin/faculty')
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CONFLICT)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_ALREADY_EXISTS);
        });
    });
  });
  describe('PUT admin/faculty/:id', () => {
    testAdminAuth(server, RequestMethod.PUT, '/admin/faculty');
    it('success: update all', () => {
      const body = {name: 'ndfsfs', shortName: 'kjweqbrewb'};
      return request(server)
        .put(`/admin/faculty/${FACULTIES.FGN.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: FACULTIES.FGN.id,
            name: body.name,
            shortName: body.shortName
          });
          const faculty = await DbUtil.getFacultyById(Faculty, FACULTIES.FGN.id);
          expect(faculty).toEqual({
            id: FACULTIES.FGN.id,
            name: body.name,
            shortName: body.shortName
          });
        });
    });
    it('success: nothing updated', () => {
      return request(server)
        .put(`/admin/faculty/${FACULTIES.INFORMATICS.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: FACULTIES.INFORMATICS.id,
            name: FACULTIES.INFORMATICS.name,
            shortName: FACULTIES.INFORMATICS.shortName
          });
          const faculty = await DbUtil.getFacultyById(Faculty, FACULTIES.INFORMATICS.id);
          expect(faculty).toEqual({
            id: FACULTIES.INFORMATICS.id,
            name: FACULTIES.INFORMATICS.name,
            shortName: FACULTIES.INFORMATICS.shortName
          });
        });
    });
    it('fail: there is already faculty with such shortName', () => {
      const body = {shortName: FACULTIES.FEN.shortName};
      return request(server)
        .post(`/admin/faculty/${FACULTIES.FGN.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CONFLICT)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_ALREADY_EXISTS);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .post('/admin/faculty/12323')
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('DELETE admin/faculty/:id', () => {
    testAdminAuth(server, RequestMethod.DELETE, '/admin/faculty');
    it('success', () => {
      return request(server)
        .delete(`/admin/faculty/${FACULTIES.INFORMATICS.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const faculty = await DbUtil.getFacultyById(Faculty, FACULTIES.INFORMATICS.id);
          expect(faculty).toBe(null);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .delete('/admin/faculty/12323')
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});