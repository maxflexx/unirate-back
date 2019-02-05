import request from 'supertest';
import express from 'express';
import { createTestData, initTestApp } from '../e2e.utils';
import {Connection} from 'typeorm';
import { USERS } from '../e2e.constants';
import { HttpStatus } from '@nestjs/common';
import { ACCESS_DENIED, INVALID_PARAMS, ITEM_NOT_FOUND, JWT_SECRET, USER_RIGHT } from '../../src/constants';
import { TimeUtil } from '../../src/utils/time-util';
const jwt = require('jwt-simple');
describe('Auth', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });

  describe('POST /auth/login', () => {
    it('success', () => {
      const start = TimeUtil.getUnixTime();
      return request(server)
        .post('/auth/login')
        .send({login: USERS.SIMPLE.login, password: USERS.SIMPLE.password, asAdmin: false})
        .expect(HttpStatus.CREATED)
        .then(response => {
          expect(response.body.token).toBeDefined();
          const payload = jwt.decode(response.body.token, JWT_SECRET);
          expect(payload).toEqual({
            login: USERS.SIMPLE.login,
            right: USER_RIGHT,
            created: expect.any(Number),
          });
          expect(response.body.isAdmin).toBe(false);
          expect(payload.created).toBeGreaterThanOrEqual(start);
        });
    });
    it('fail: no such user', () => {
      return request(server)
        .post('/auth/login')
        .send({login: 'invalid_user', password: USERS.SIMPLE.password, asAdmin: false})
        .expect(HttpStatus.NOT_FOUND)
        .then(response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: no password field', () => {
      return request(server)
        .post('/auth/login')
        .send({login: USERS.SIMPLE.login, asAdmin: false})
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
    it('fail: access denied', () => {
      return request(server)
        .post('/auth/login')
        .send({login: USERS.SIMPLE.login, password: USERS.SIMPLE.password, asAdmin: true})
        .expect(HttpStatus.FORBIDDEN)
        .then(response => {
          expect(response.body.error).toBe(ACCESS_DENIED);
        });
    });
  });
});