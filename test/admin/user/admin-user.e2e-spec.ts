import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, PROFESSIONS, USERS } from '../../e2e.constants';
import request from 'supertest';
import { User, UserRole } from '../../../src/entities/user.entity';
import { DbUtil } from '../../../src/utils/db-util';
import { ACCESS_DENIED, ITEM_NOT_FOUND } from '../../../src/constants';
import { CryptoUtil } from '../../../src/utils/crypto-util';

describe('Admin User', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/user', () => {
    testAdminAuth(server, RequestMethod.GET, `/admin/user`);
    it('success: filter by login', () => {
      return request(server)
        .get(`/admin/user`)
        .query(`userLogin=${USERS.SIMPLE_FGN.login}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.user).toEqual([{
            login: USERS.SIMPLE_FGN.login,
            email: USERS.SIMPLE_FGN.email,
            rating: 18, // avg(feedback.rating)
            role: USERS.SIMPLE_FGN.role,
            professionName: USERS.SIMPLE_FGN.profession.name,
            totalFeedbackNumber: 3
          }]);
        });
    });
    it('success: offset & count', () => {
      return request(server)
        .get(`/admin/user`)
        .query(`offset=1&limit=1`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(5);
          expect(response.body.user).toEqual([{
            login: USERS.GRADE_FEEDBACKS.login,
            email: USERS.GRADE_FEEDBACKS.email,
            rating: 0,
            role: USERS.GRADE_FEEDBACKS.role,
            professionName: null,
            totalFeedbackNumber: 0
          }]);
        });
    });
    it('success: order by', () => {
      return request(server)
        .get(`/admin/user`)
        .query(`orderBy=rating DESC&limit=2`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(5);
          expect(response.body.user).toEqual([{
            login: USERS.SIMPLE.login,
            email: USERS.SIMPLE.email,
            rating: 42,
            role: USERS.SIMPLE.role,
            professionName: USERS.SIMPLE.profession.name,
            totalFeedbackNumber: 3
          }, {
            login: USERS.SIMPLE_FGN.login,
            email: USERS.SIMPLE_FGN.email,
            rating: 18, // avg(feedback.rating)
            role: USERS.SIMPLE_FGN.role,
            professionId: USERS.SIMPLE_FGN.profession.id,
            totalFeedbackNumber: 3
          }]);
        });
    });
  });
  describe('PUT admin/user/:login', () => {
    it('success', () => {
      const body = { role: UserRole.ADMIN};
      return request(server)
        .put(`/admin/user/${USERS.SIMPLE.login}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            login: USERS.SIMPLE.login,
            email: USERS.SIMPLE.email,
            role: body.role,
            professionId: USERS.SIMPLE.profession.id,
          });
          const user = await DbUtil.getUserByLogin(User, USERS.SIMPLE.login);
          expect(user.role).toBe(body.role);
        });
    });
    it('fail: not found', () => {
      const body = { role: UserRole.ADMIN};
      return request(server)
        .put(`/admin/user/ejrslgnfe`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('PUT admin/:login', () => {
    testAdminAuth(server, RequestMethod.PUT, '/admin/login');
    it('success: all params', () => {
      const body = {email: 'ryepkin.maks@gmail.com', password: CryptoUtil.getPasswordHash('qwefds'), professionId: PROFESSIONS.GERMAN_PHILOLOGY.id};
      return request(server)
        .put(`/admin/${USERS.ADMIN_USER.login}`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            login: USERS.ADMIN_USER.login,
            professionId: body.professionId,
            email: body.email
          });
          const user = await DbUtil.getOne(User, `SELECT * FROM user u WHERE u.login="${USERS.ADMIN_USER.login}"`);
          expect(user).toBeDefined();
          expect(user.password).toBe(body.password);
          expect(user.email).toBe(body.email);
          expect(user.professionId).toBe(body.professionId);
        });
    });
    it('fail: not owner', () => {
      return request(server)
        .put(`/admin/${USERS.SIMPLE_FGN.login}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.FORBIDDEN)
        .then(response => {
          expect(response.body.error).toBe(ACCESS_DENIED);
        });
    });
  });
  describe('DELETE admin/user/:login', () => {
    testAdminAuth(server, RequestMethod.DELETE, `/admin/user/${USERS.SIMPLE_FGN.login}`);
    it('success: other', () => {
      return request(server)
        .delete(`/admin/user/${USERS.SIMPLE.login}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const user = await DbUtil.getUserByLogin(User, USERS.SIMPLE.login);
          expect(user).toBe(null);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .delete(`/admin/user/ekrgnfsd`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('success: myself', () => {
      return request(server)
        .delete(`/admin/user/${USERS.ADMIN_USER.login}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const user = await DbUtil.getUserByLogin(User, USERS.ADMIN_USER.login);
          expect(user).toBe(null);
        });
    });
  });
});