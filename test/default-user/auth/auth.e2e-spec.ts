import request from 'supertest';
import express from 'express';
import { createTestData, initTestApp } from '../../e2e.utils';
import {Connection} from 'typeorm';
import { DISCIPLINE, FEEDBACKS, PROFESSIONS, USERS, USERS_JWT } from '../../e2e.constants';
import { HttpStatus } from '@nestjs/common';
import { ACCESS_DENIED, INVALID_PARAMS, ITEM_ALREADY_EXISTS, ITEM_NOT_FOUND, JWT_SECRET, PASSWORD_HASH_SALT, USER_RIGHT } from '../../../src/constants';
import { TimeUtil } from '../../../src/utils/time-util';
import { User, UserRole } from '../../../src/entities/user.entity';
import { DbUtil } from '../../../src/utils/db-util';
const jwt = require('jwt-simple');
const crypto = require('crypto');
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
        .send({login: USERS.SIMPLE.login, password: USERS.SIMPLE.password})
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
        .send({login: 'invalid_user', password: USERS.SIMPLE.password})
        .expect(HttpStatus.NOT_FOUND)
        .then(response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: no password field', () => {
      return request(server)
        .post('/auth/login')
        .send({login: USERS.SIMPLE.login})
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
  });
  describe('POST auth/signup', () => {
    it('success', () => {
      const body = {login: 'new_user', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('new_pass').digest('base64'), email: 'ryepkin.maksym@gmail.com'};
      return request(server)
        .post('/auth/signup')
        .send(body)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            login: body.login,
            password: body.password,
            email: body.email,
            role: UserRole.USER,
          });
          const user = await DbUtil.getOne(User, `SELECT * FROM user u WHERE u.login="${body.login}"`);
          expect(user).toBeDefined();
          expect(user.password).toBe(body.password);
        });
    });
    it('success: profession id', () => {
      const body = {login: 'new_user1', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('new_pass').digest('base64'), email: 'ryepkin.masum@gmail.com', professionId: PROFESSIONS.ECONOMIST.id};
      return request(server)
        .post('/auth/signup')
        .send(body)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            login: body.login,
            password: body.password,
            email: body.email,
            role: UserRole.USER,
            professionId: body.professionId
          });
          const user = await DbUtil.getOne(User, `SELECT * FROM user u WHERE u.login="${body.login}"`);
          expect(user).toBeDefined();
          expect(user.password).toBe(body.password);
          expect(user.professionId).toBe(body.professionId);
        });
    });
    it('fail: already exists', () => {
      const body = {login: USERS.SIMPLE.login, password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('new_pass').digest('base64'), email: 'ryepkin.maskum@gmail.com', professionId: PROFESSIONS.ECONOMIST.id};
      return request(server)
        .post('/auth/signup')
        .send(body)
        .expect(HttpStatus.CONFLICT)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_ALREADY_EXISTS);
        });
    });
    it('fail: no login', () => {
      const body = { password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('new_pass').digest('base64'), email: 'user@gmail.com', professionId: PROFESSIONS.ECONOMIST.id};
      return request(server)
        .post('/auth/signup')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
  });
});
