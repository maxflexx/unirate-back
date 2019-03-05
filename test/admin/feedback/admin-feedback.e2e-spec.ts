import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, FACULTIES, FEEDBACK_TEACHER, FEEDBACKS, USERS_JWT } from '../../e2e.constants';
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
  describe('GET admin/feedback', () => {
    testAdminAuth(server, RequestMethod.GET, `/admin/feedback`);
    it('success : disciplineId', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(3);
          expect(response.body.feedback).toEqual([{
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
    it('success : facultyId', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`facultyId=${FACULTIES.INFORMATICS.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(6);
          expect(response.body.feedback).toEqual([{
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
          }, {
            feedbackId: FEEDBACKS.OBDZ1.id,
            rating: FEEDBACKS.OBDZ1.rating,
            comment: FEEDBACKS.OBDZ1.comment,
            studentGrade: FEEDBACKS.OBDZ1.studentGrade,
            created: FEEDBACKS.OBDZ1.created,
            userLogin: FEEDBACKS.OBDZ1.user.login,
            disciplineId: FEEDBACKS.OBDZ1.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.GULAEVA_OBDZ1.teacher.id]
          }, {
            feedbackId: FEEDBACKS.OBDZ2.id,
            rating: FEEDBACKS.OBDZ2.rating,
            comment: FEEDBACKS.OBDZ2.comment,
            studentGrade: null,
            created: FEEDBACKS.OBDZ2.created,
            userLogin: FEEDBACKS.OBDZ2.user.login,
            disciplineId: FEEDBACKS.OBDZ2.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.GULAEVA_OBDZ2.teacher.id, FEEDBACK_TEACHER.USHENKO_OBDZ2.teacher.id]
          }, {
            feedbackId: FEEDBACKS.PROCEDURE1.id,
            rating: FEEDBACKS.PROCEDURE1.rating,
            comment: FEEDBACKS.PROCEDURE1.comment,
            studentGrade: null,
            created: FEEDBACKS.PROCEDURE1.created,
            userLogin: FEEDBACKS.PROCEDURE1.user.login,
            disciplineId: FEEDBACKS.PROCEDURE1.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.BOUBLIK_PROCEDURE1.teacher.id]
          }]);
        });
    });
    it('success : no params', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(``)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(6);
          expect(response.body.feedback).toEqual([{
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
          }, {
            feedbackId: FEEDBACKS.OBDZ1.id,
            rating: FEEDBACKS.OBDZ1.rating,
            comment: FEEDBACKS.OBDZ1.comment,
            studentGrade: FEEDBACKS.OBDZ1.studentGrade,
            created: FEEDBACKS.OBDZ1.created,
            userLogin: FEEDBACKS.OBDZ1.user.login,
            disciplineId: FEEDBACKS.OBDZ1.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.GULAEVA_OBDZ1.teacher.id]
          }, {
            feedbackId: FEEDBACKS.OBDZ2.id,
            rating: FEEDBACKS.OBDZ2.rating,
            comment: FEEDBACKS.OBDZ2.comment,
            studentGrade: null,
            created: FEEDBACKS.OBDZ2.created,
            userLogin: FEEDBACKS.OBDZ2.user.login,
            disciplineId: FEEDBACKS.OBDZ2.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.GULAEVA_OBDZ2.teacher.id, FEEDBACK_TEACHER.USHENKO_OBDZ2.teacher.id]
          }, {
            feedbackId: FEEDBACKS.PROCEDURE1.id,
            rating: FEEDBACKS.PROCEDURE1.rating,
            comment: FEEDBACKS.PROCEDURE1.comment,
            studentGrade: null,
            created: FEEDBACKS.PROCEDURE1.created,
            userLogin: FEEDBACKS.PROCEDURE1.user.login,
            disciplineId: FEEDBACKS.PROCEDURE1.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.BOUBLIK_PROCEDURE1.teacher.id]
          }]);
        });
    });
    it('success : disciplineId and facultyId', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}&facultyId=${FACULTIES.INFORMATICS.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(3);
          expect(response.body.feedback).toEqual([{
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
    it('success : disciplineId and facultyId, order by rating', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}&facultyId=${FACULTIES.INFORMATICS.id}&orderBy=rating`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(3);
          expect(response.body.feedback).toEqual([{
            feedbackId: FEEDBACKS.OOP3.id,
            rating: FEEDBACKS.OOP3.rating,
            comment: FEEDBACKS.OOP3.comment,
            studentGrade: FEEDBACKS.OOP3.studentGrade,
            created: FEEDBACKS.OOP3.created,
            userLogin: FEEDBACKS.OOP3.user.login,
            disciplineId: FEEDBACKS.OOP3.discipline.id,
            teacherIds: [FEEDBACK_TEACHER.BOUBLIK_OOP3.teacher.id]
          }, {
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
          }]);
        });
    });
    it('empty result : disciplineId and facultyId do not match', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}&facultyId=${FACULTIES.FGN.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(0);
          expect(response.body.feedback).toEqual([]);
        });
    });
    it('fail: invalid disciplineId', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`disciplineId=ewkjf`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
        });
    });
    it('fail: invalid facultyId', () => {
      return request(server)
        .get(`/admin/feedback`)
        .query(`facultyId=ewkjf`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
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