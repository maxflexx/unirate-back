import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testUserAuth } from '../../e2e.utils';
import request from 'supertest';
import { DISCIPLINE, FACULTIES, FEEDBACK_GRADE, FEEDBACK_TEACHER, FEEDBACKS, TEACHER, USERS, USERS_JWT } from '../../e2e.constants';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { INVALID_PARAMS, IS_NOT_ITEM_OWNER, ITEM_NOT_FOUND, STATUS_OK } from '../../../src/constants';
import { DbUtil } from '../../../src/utils/db-util';
import { Feedback } from '../../../src/entities/feedback.entity';
import { TimeUtil } from '../../../src/utils/time-util';
import { FeedbackTeacher } from '../../../src/entities/feedback-teacher.entity';
import { FeedbackGrade } from '../../../src/entities/feedback-grade.entity';

describe('Feedback', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('GET feedback', () => {
    testUserAuth(server, RequestMethod.GET, `/feedback`);
    it('success : disciplineId', () => {
      return request(server)
        .get(`/feedback?limit=1`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          //expect(response.body.total).toBe(3);
          expect(response.body.feedback).toEqual([{
            feedbackId: FEEDBACKS.OOP1.id,
            rating: FEEDBACKS.OOP1.rating,
            comment: FEEDBACKS.OOP1.comment,
            studentGrade: FEEDBACKS.OOP1.studentGrade,
            created: FEEDBACKS.OOP1.created,
            userLogin: FEEDBACKS.OOP1.user.login,
            disciplineName: FEEDBACKS.OOP1.discipline.name,
            disciplineYear: FEEDBACKS.OOP1.discipline.year,
            teachers: [FEEDBACK_TEACHER.BOUBLIK_OOP1.teacher, FEEDBACK_TEACHER.GORBORUKOV_OOP1.teacher]
          }]);
          // }, {
          //   feedbackId: FEEDBACKS.OOP2.id,
          //   rating: FEEDBACKS.OOP2.rating,
          //   comment: FEEDBACKS.OOP2.comment,
          //   studentGrade: null,
          //   created: FEEDBACKS.OOP2.created,
          //   userLogin: FEEDBACKS.OOP2.user.login,
          //   disciplineId: FEEDBACKS.OOP2.discipline.id,
          //   teacherIds: [FEEDBACK_TEACHER.BOUBLIK_OOP2.teacher.id]
          // }, {
          //   feedbackId: FEEDBACKS.OOP3.id,
          //   rating: FEEDBACKS.OOP3.rating,
          //   comment: FEEDBACKS.OOP3.comment,
          //   studentGrade: FEEDBACKS.OOP3.studentGrade,
          //   created: FEEDBACKS.OOP3.created,
          //   userLogin: FEEDBACKS.OOP3.user.login,
          //   disciplineId: FEEDBACKS.OOP3.discipline.id,
          //   teacherIds: [FEEDBACK_TEACHER.BOUBLIK_OOP3.teacher.id]
          // }]);
        });
    });
    it('success : facultyId', () => {
      return request(server)
        .get(`/feedback`)
        .query(`facultyId=${FACULTIES.INFORMATICS.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
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
        .get(`/feedback`)
        .query(``)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
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
        .get(`/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}&facultyId=${FACULTIES.INFORMATICS.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
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
        .get(`/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}&facultyId=${FACULTIES.INFORMATICS.id}&orderBy=rating`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
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
        .get(`/feedback`)
        .query(`disciplineId=${DISCIPLINE.OOP.id}&facultyId=${FACULTIES.FGN.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(0);
          expect(response.body.feedback).toEqual([]);
        });
    });
    it('fail: invalid disciplineId', () => {
      return request(server)
        .get(`/feedback`)
        .query(`disciplineId=ewkjf`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
        });
    });
    it('fail: invalid facultyId', () => {
      return request(server)
        .get(`/feedback`)
        .query(`facultyId=ewkjf`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.BAD_REQUEST)
        .then(response => {
          expect(response.body.error).toEqual(INVALID_PARAMS);
        });
    });
  });
  describe('POST feedback/:disciplineId', () => {
    testUserAuth(server, RequestMethod.POST, `/feedback/${DISCIPLINE.OBDZ.id}`);
    it('success', () => {
      const body = {studentGrade: 71, comment: 'мінус матьґ', teachersIds: [TEACHER.USHENKO.id, TEACHER.GULAEVA.id]};
      const start = TimeUtil.getUnixTime();
      return request(server)
        .post(`/feedback/${DISCIPLINE.OBDZ.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .send(body)
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            studentGrade: body.studentGrade,
            comment: body.comment,
            teachersIds: body.teachersIds,
            disciplineId: DISCIPLINE.OBDZ.id,
            rating: 0
          });
          const feedback = await DbUtil.getFeedbackById(Feedback, response.body.id);
          expect(feedback).toBeDefined();
          expect(feedback).toEqual({
            id: response.body.id,
            studentGrade: body.studentGrade,
            rating: 0,
            comment: body.comment,
            created: expect.any(Number),
            userLogin: USERS.SIMPLE.login,
            disciplineId: DISCIPLINE.OBDZ.id
          });
          expect(feedback.created).toBeGreaterThanOrEqual(start);
          const feedbackTeachers = await DbUtil.getMany(FeedbackTeacher, `SELECT * FROM feedback_teacher WHERE feedback_id=${feedback.id}`);
          expect(feedbackTeachers).toHaveLength(2);
          expect(feedbackTeachers.map(item => item.teacherId)).toEqual([TEACHER.GULAEVA.id, TEACHER.USHENKO.id]);
        });
    });
    it('fail: teacher ids', () => {
      const body = {studentGrade: 71, comment: 'AWESOME BD', teachersIds: [TEACHER.USHENKO.id, 'inval']};
      return request(server)
        .post(`/feedback/${DISCIPLINE.OBDZ.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .send(body)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
    it('fail: no such discipline', () => {
      const body = {studentGrade: 71, comment: 'AWESOME BD', teachersIds: [TEACHER.USHENKO.id]};
      return request(server)
        .post(`/feedback/999`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .send(body)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('POST feedback/grade/:feedbackId', async () => {
    testUserAuth(server, RequestMethod.POST, `/feedback/grade/${FEEDBACKS.OOP1.id}`);
    it('success: new', async () => {
      const oop = await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OOP1.id);
      return request(server)
        .post(`/feedback/grade/${FEEDBACKS.OOP1.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .send({like: 1})
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            like: 1,
            userLogin: USERS.SIMPLE.login,
            feedbackId: FEEDBACKS.OOP1.id
          });
          const updatedFeedback =  await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OOP1.id);
          expect(updatedFeedback.rating).toBe(oop.rating + 1);
          const grade = await DbUtil.getFeedbackGrade(FeedbackGrade, FEEDBACKS.OOP1.id, USERS.SIMPLE.login);
          expect(grade).toEqual({
            id: expect.any(Number),
            like: 1,
            feedbackId: FEEDBACKS.OOP1.id,
            userLogin: USERS.SIMPLE.login
          });
        });
    });
    it('success: update old', async () => {
      const obdz = await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OBDZ1.id);
      return request(server)
        .post(`/feedback/grade/${FEEDBACKS.OBDZ1.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.GRADE_FEEDBACKS)
        .send({like: -1})
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: FEEDBACK_GRADE.OBDZ.id,
            like: -1,
            userLogin: USERS.GRADE_FEEDBACKS.login,
            feedbackId: FEEDBACKS.OBDZ1.id
          });
          const updatedFeedback =  await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OBDZ1.id);
          expect(updatedFeedback.rating).toBe(obdz.rating - 1);
          const grade = await DbUtil.getFeedbackGrade(FeedbackGrade, FEEDBACKS.OBDZ1.id, USERS.GRADE_FEEDBACKS.login);
          expect(grade).toEqual({
            id: expect.any(Number),
            like: -1,
            feedbackId: FEEDBACKS.OBDZ1.id,
            userLogin: USERS.GRADE_FEEDBACKS.login
          });
        });
    });
    it('success: nothing updated', async () => {
      const oop = await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OOP3.id);
      return request(server)
        .post(`/feedback/grade/${FEEDBACKS.OOP3.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.GRADE_FEEDBACKS1)
        .send({like: 1})
        .expect(HttpStatus.CREATED)
        .then(async response => {
          expect(response.body).toEqual({
            id: FEEDBACK_GRADE.OOP3.id,
            like: 1,
            userLogin: USERS.GRADE_FEEDBACKS1.login,
            feedbackId: FEEDBACKS.OOP3.id
          });
          const updatedFeedback =  await DbUtil.getFeedbackById(Feedback, FEEDBACKS.OOP3.id);
          expect(updatedFeedback.rating).toBe(oop.rating);
          const grade = await DbUtil.getFeedbackGrade(FeedbackGrade, FEEDBACKS.OOP3.id, USERS.GRADE_FEEDBACKS1.login);
          expect(grade).toEqual({
            id: expect.any(Number),
            like: 1,
            feedbackId: FEEDBACKS.OOP3.id,
            userLogin: USERS.GRADE_FEEDBACKS1.login
          });
        });
    });
    it('fail: invalid like value', () => {
      return request(server)
        .post(`/feedback/grade/${FEEDBACKS.OOP1.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .send({like: 10})
        .expect(HttpStatus.BAD_REQUEST)
        .then(async response => {
          expect(response.body.error).toBe(INVALID_PARAMS);
        });
    });
    it('fail: no such feedback', () => {
      return request(server)
        .post(`/feedback/grade/999`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .send({like: 1})
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
  describe('DELETE feedback/:id', () => {
    testUserAuth(server, RequestMethod.DELETE, `/feedback/${FEEDBACKS.OOP2.id}`);
    it('success', () => {
      return request(server)
        .delete(`/feedback/${FEEDBACKS.OOP1.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
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
    it('fail: not owner', () => {
      return request(server)
        .delete(`/feedback/${FEEDBACKS.OOP3.id}`)
        .set('Authorization', 'Bearer ' + USERS_JWT.GRADE_FEEDBACKS)
        .expect(HttpStatus.FORBIDDEN)
        .then(async response => {
          expect(response.body.error).toBe(IS_NOT_ITEM_OWNER);
        });
    });
    it('fail: no such feedback', () => {
      return request(server)
        .delete(`/feedback/999`)
        .set('Authorization', 'Bearer ' + USERS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
  });
});
