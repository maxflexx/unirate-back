import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, FACULTIES, TEACHER } from '../../e2e.constants';
import request from 'supertest';
import { DbUtil } from '../../../src/utils/db-util';
import { Teacher } from '../../../src/entities/teacher.entity';
import { INVALID_PARAMS, ITEM_NOT_FOUND } from '../../../src/constants';

describe('Admin Teachers', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/teacher', () => {
    testAdminAuth(server, RequestMethod.GET, `/admin/teacher`);
    it('success: filter by id', () => {
      return request(server)
        .get(`/admin/teacher`)
        .query(`teacherId=${TEACHER.USHENKO.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.teacher).toEqual([{
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
        .get(`/admin/teacher`)
        .query(`search=Ush`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.teacher).toEqual([{
            id: TEACHER.USHENKO.id,
            lastName: TEACHER.USHENKO.lastName,
            name: TEACHER.USHENKO.name,
            middleName: TEACHER.USHENKO.middleName,
            feedbackNumber: 1
          }]);
        });
    });
  });
  describe('POST admin/teacher', () => {
    testAdminAuth(server, RequestMethod.POST, `/admin/teacher`);
    it('success', () => {
      const body = { name: 'new', lastName: 'teacher', middleName: 'awesome' };
      return request(server)
        .post(`/admin/teacher`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            lastName: body.lastName,
            name: body.name,
            middleName: body.middleName
          });
          const teacher = await DbUtil.getTeacherById(Teacher, response.body.id);
          expect(teacher).toEqual(response.body);
        });
    });
    it('fail: no name', () => {
      const body = { lastName: 'teacher', middleName: 'awesome' };
      return request(server)
        .post(`/admin/teacher`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
  });
  describe('PUT admin/teacher/:id', () => {
    testAdminAuth(server, RequestMethod.PUT, `/admin/teacher/1`);
    it('success: update all', () => {
      const body = { name: 'cool', lastName: 'new', middleName: 'teacher' };
      return request(server)
        .put(`/admin/teacher/${TEACHER.GULAEVA.id}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: TEACHER.GULAEVA.id,
            name: body.name,
            lastName: body.lastName,
            middleName: body.middleName
          });
          const teacher = await DbUtil.getTeacherById(Teacher, TEACHER.GULAEVA.id);
          expect(teacher).toEqual(response.body);
        });
    });
    it('success: nothing updated', () => {
      return request(server)
        .put(`/admin/teacher/${TEACHER.USHENKO.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            id: TEACHER.USHENKO.id,
            name: TEACHER.USHENKO.name,
            lastName: TEACHER.USHENKO.lastName,
            middleName: TEACHER.USHENKO.middleName
          });
          const teacher = await DbUtil.getTeacherById(Teacher, TEACHER.USHENKO.id);
          expect(teacher).toEqual(TEACHER.USHENKO);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .put(`/admin/teacher/99999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('DELETE admin/teacher/:id', () => {
    testAdminAuth(server, RequestMethod.DELETE, `/admin/teacher/1`);
    it('success', () => {
      return request(server)
        .delete(`/admin/teacher/${TEACHER.GORBORUKOV.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const teacher = await DbUtil.getTeacherById(Teacher, TEACHER.GORBORUKOV.id);
          expect(teacher).toBe(null);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .delete(`/admin/teacher/99999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});