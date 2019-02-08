import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testUserAuth } from '../e2e.utils';
import request from 'supertest';
import { DISCIPLINE, FEEDBACK_TEACHER, FEEDBACKS, USERS_JWT } from '../e2e.constants';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { INVALID_PARAMS, ITEM_NOT_FOUND } from '../../src/constants';

describe('Feedback', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET feedback/:disciplineId', () => {
    testUserAuth(server, RequestMethod.GET, `/feedback/${DISCIPLINE.OOP.id}`);
    it('success', () => {
      return request(server)
        .get(`/feedback/${DISCIPLINE.OOP.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body).toEqual([{
            feedbackId: FEEDBACKS.OOP1.id,
            rating: FEEDBACKS.OOP1.rating,
            comment: FEEDBACKS.OOP1.comment,
            studentGrade: FEEDBACKS.OOP1.studentGrade,
            created: FEEDBACKS.OOP1.created,
            userLogin: FEEDBACKS.OOP1.user.login,
            disciplineId: FEEDBACKS.OOP1.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.BOUBLIK_OOP1.teacher.id, FEEDBACK_TEACHER.GORBORUKOV_OOP1.teacher.id]
          }, {
            feedbackId: FEEDBACKS.OOP2.id,
            rating: FEEDBACKS.OOP2.rating,
            comment: FEEDBACKS.OOP2.comment,
            studentGrade: null,
            created: FEEDBACKS.OOP2.created,
            userLogin: FEEDBACKS.OOP2.user.login,
            disciplineId: FEEDBACKS.OOP2.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.BOUBLIK_OOP2.teacher.id]
          }, {
            feedbackId: FEEDBACKS.OOP3.id,
            rating: FEEDBACKS.OOP3.rating,
            comment: FEEDBACKS.OOP3.comment,
            studentGrade: FEEDBACKS.OOP3.studentGrade,
            created: FEEDBACKS.OOP3.created,
            userLogin: FEEDBACKS.OOP3.user.login,
            disciplineId: FEEDBACKS.OOP3.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.BOUBLIK_OOP3.teacher.id]
          }]);
        });
    });
    it('fail: invalid params', () => {
      return request(server)
        .get(`/feedback/ewkjf`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .get(`/feedback/999`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
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