import express from '../auth/auth.e2e-spec';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testUserAuth } from '../e2e.utils';
import { USERS, USERS_JWT } from '../e2e.constants';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import request from 'supertest';
import { ITEM_NOT_FOUND } from '../../src/constants';

describe('User', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });

  describe('GET /user/:login', () => {
    //testUserAuth(server, RequestMethod.GET, `/user/${USERS.SIMPLE.login}`);
    it('success', () => {
      return request(server)
        .get(`/user/${USERS.SIMPLE.login}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body).toBeDefined();
          expect(response.body).toEqual({
            login: USERS.SIMPLE.login,
            email: USERS.SIMPLE.email,
            rating: USERS.SIMPLE.rating,
            professionName: USERS.SIMPLE.profession.name
          });
        });
    });
    it('fail: no such user', () => {
      return request(server)
        .get('/user/invalid_login')
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});