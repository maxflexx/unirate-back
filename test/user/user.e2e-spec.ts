import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, } from '../e2e.utils';
import { PROFESSIONS, USERS, USERS_JWT } from '../e2e.constants';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { ITEM_NOT_FOUND } from '../../src/constants';
import { CryptoUtil } from '../../src/utils/crypto-util';
import { DbUtil } from '../../src/utils/db-util';
import { User } from '../../src/entities/user.entity';

describe('User', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });

  describe('GET /user/:login', () => { // TODO: add auth test
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
  describe('PUT user/:login', () => { //TODO: add auth test, add one test on fail, trying to change not someone else data
    it('success: all params', () => {
      const body = {email: 'ryepkin.maks@gmail.com', password: CryptoUtil.getPasswordHash('qwefds'), professionId: PROFESSIONS.GERMAN_PHILOLOGY.id};
      return request(server)
        .put(`/user/${USERS.SIMPLE_FGN.login}`)
        .send(body)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            login: USERS.SIMPLE_FGN.login,
            professionId: body.professionId,
            email: body.email
          });
          const user = await DbUtil.getOne(User, `SELECT * FROM user u WHERE u.login="${USERS.SIMPLE_FGN.login}"`);
          expect(user).toBeDefined();
          expect(user.password).toBe(body.password);
          expect(user.email).toBe(body.email);
          expect(user.professionId).toBe(body.professionId);
          expect(user.rating).toBe(USERS.SIMPLE_FGN.rating);
        });
    });
    it('success: not params', () => {
      const body = { password: CryptoUtil.getPasswordHash('qwefds')};
      return request(server)
        .put(`/user/${USERS.SIMPLE.login}`)
        .send(body)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual({
            login: USERS.SIMPLE.login,
            professionId: USERS.SIMPLE.profession.id,
            email: USERS.SIMPLE.email
          });
          const user = await DbUtil.getOne(User, `SELECT * FROM user u WHERE u.login="${USERS.SIMPLE.login}"`);
          expect(user).toBeDefined();
          expect(user.email).toBe(USERS.SIMPLE.email);
          expect(user.password).toBe(body.password);
          expect(user.professionId).toBe(USERS.SIMPLE.profession.id);
          expect(user.rating).toBe(USERS.SIMPLE.rating);
        });
    });
    it('fail: no such user', () => {
      return request(server)
        .put('/user/invalid_login')
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('DELETE user/:login', () => {//TODO: add test, fail trying to delete someone else account
    it('success', () => {
      return request(server)
        .delete(`/user/${USERS.SIMPLE.login}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.text).toBe('OK');
          const user = await DbUtil.getUserByLogin(User, USERS.SIMPLE.login);
          expect(user).toBe(null);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .delete(`/user/werglmnre`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        })
    });
  });
});