import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, FEEDBACK_TEACHER, FEEDBACKS } from '../../e2e.constants';
import request from 'supertest';
import { INVALID_PARAMS, ITEM_NOT_FOUND, STATUS_OK } from '../../../src/constants';
import { DbUtil } from '../../../src/utils/db-util';
import { Feedback } from '../../../src/entities/feedback.entity';
import { FeedbackGrade } from '../../../src/entities/feedback-grade.entity';
import { FeedbackTeacher } from '../../../src/entities/feedback-teacher.entity';

describe('Feedback', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET admin/feedback/:disciplineId', () => {
    testAdminAuth(server, RequestMethod.GET, `/admin/feedback/${DISCIPLINE.OOP.id}`);
    it('success', () => {
      return request(server)
        .get(`/admin/feedback/${DISCIPLINE.OOP.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
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
        .get(`/admin/feedback/ewkjf`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
        });
    });
    it('fail: not found', () => {
      return request(server)
        .get(`/admin/feedback/999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(response => {
          expect(response.body.error).toEqual(ITEM_NOT_FOUND);
        });
    });
  });
  describe('DELETE admin/feedback/:id', () => {
    testAdminAuth(server, RequestMethod.DELETE, `/admin/feedback/${FEEDBACKS.OOP3.id}`);
    it('success', () => {
      return request(server)
        .delete(`/admin/feedback/${FEEDBACKS.OOP1.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.text).toBe(STATUS_OK);
          const feedback = await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OOP1.id);
          expect(feedback).toBe(null);
          const grades = await DbUtil.getMany(FeedbackGrade, `SELECT * FROM feedback_grade WHERE feedback_id=${FEEDBACKS.OOP1.id}`);
          expect(grades).toBe(null);
          const feedbackTeachers = await DbUtil.getMany(FeedbackTeacher, `SELECT * FROM feedback_teacher WHERE feedback_id=${FEEDBACKS.OOP1.id}`);
          expect(feedbackTeachers).toBe(null);
        });
    });
    it('fail: no such feedback', () => {
      return request(server)
        .delete(`/admin/feedback/999`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});