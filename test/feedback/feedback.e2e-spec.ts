import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp } from '../e2e.utils';
import request from 'supertest';
import { DISCIPLINE, FEEDBACKS, USERS_JWT } from '../e2e.constants';
import { HttpStatus } from '@nestjs/common';
import { INVALID_PARAMS, ITEM_NOT_FOUND } from '../../src/constants';

describe('Feedback', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET feedback/:discipline_id', () => {
    it('success', () => {
      return request(server)
        .get(`/feedback/${DISCIPLINE.PROCEDURE.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.FORBIDDEN)
        .then(response => {
          expect(response.body).toEqual([{
            id: FEEDBACKS.PROCEDURE1.id,
            rating: FEEDBACKS.PROCEDURE1.rating,
            comment: FEEDBACKS.PROCEDURE1.comment,
            created: FEEDBACKS.PROCEDURE1.created,
            userLogin: FEEDBACKS.PROCEDURE1.user.login,
            disciplineId: FEEDBACKS.PROCEDURE1.discipline.id
          }]);
        });
    });
    it('fail: invalid params', () => {
      return request(server)
        .get(`/feedback/ewkjf`)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .get(`/feedback/999`)
        .expect(HttpStatus.NOT_FOUND)
        .then(response => {
          expect(response.body.error).toEqual(ITEM_NOT_FOUND);
        });
    });
  });
  describe('POST feedback/:disciplineId', () => {
    it('success', () => {
      const body = {studentGrade: 71, comment: 'AWESOME OOP'}
    })
  });
});