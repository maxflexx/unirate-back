import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, PROFESSIONS, TEACHER, USERS } from '../../e2e.constants';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { Connection } from 'typeorm';
import express from 'express';
import request from 'supertest';
import { DbUtil } from '../../../src/utils/db-util';
import { TimeUtil } from '../../../src/utils/time-util';


describe('Admin Statistics', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
    await DbUtil.insertOne(`INSERT INTO feedback(student_grade, rating, comment, created, user_login, discipline_id) VALUES (99,5, "OK", ${TimeUtil.getUnixTime()}, "${USERS.SIMPLE.login}", ${DISCIPLINE.ENGLISH.id})`);
  });
  describe('GET admin/statistics/profession', () => {
    testAdminAuth(server, RequestMethod.GET, '/admin/statistics/profession');

    it('success: all', () => {
      return request(server)
        .get(`/admin/statistics/profession`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(1);
          expect(response.body.profession).toEqual([{
            id: PROFESSIONS.SOFTWARE_DEVELOPMENT.id,
            name: PROFESSIONS.SOFTWARE_DEVELOPMENT.name,
            facultyId: PROFESSIONS.SOFTWARE_DEVELOPMENT.faculty.id
          }]);
        });
    });
  });
  describe('GET admin/statistics/popular-teacher', () => {
    testAdminAuth(server, RequestMethod.GET, '/admin/statistics/popular-teacher');
    it('success: all', () => {
      return request(server)
        .get(`/admin/statistics/popular-teacher`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(4);
          expect(response.body.teacher).toEqual([{
            id: TEACHER.BOUBLIK.id,
            lastName: TEACHER.BOUBLIK.lastName,
            name: TEACHER.BOUBLIK.name,
            middleName: TEACHER.BOUBLIK.middleName,
            feedbackNum: 4
          }, {
            id: TEACHER.GULAEVA.id,
            lastName: TEACHER.GULAEVA.lastName,
            name: TEACHER.GULAEVA.name,
            middleName: TEACHER.GULAEVA.middleName,
            feedbackNum: 2
          }, {
            id: TEACHER.GORBORUKOV.id,
            lastName: TEACHER.GORBORUKOV.lastName,
            name: TEACHER.GORBORUKOV.name,
            middleName: TEACHER.GORBORUKOV.middleName,
            feedbackNum: 1
          }, {
            id: TEACHER.USHENKO.id,
            lastName: TEACHER.USHENKO.lastName,
            name: TEACHER.USHENKO.name,
            middleName: TEACHER.USHENKO.middleName,
            feedbackNum: 1
          }]);
        });
    });
  });
  describe('GET admin/statistics/most-active-users', () => {
    testAdminAuth(server, RequestMethod.GET, '/admin/statistics/most-active-user');
    it('success', () => {
      return request(server)
        .get(`/admin/statistics/most-active-user`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(5);
          expect(response.body.user).toEqual([{
            login: USERS.SIMPLE.login,
            email: USERS.SIMPLE.email,
            professionId: USERS.SIMPLE.profession.id,
            feedbackNum: 4
          }, {
            login: USERS.SIMPLE_FGN.login,
            email: USERS.SIMPLE_FGN.email,
            professionId: USERS.SIMPLE_FGN.profession.id,
            feedbackNum: 3
          }, {
            login: USERS.ADMIN_USER.login,
            email: USERS.ADMIN_USER.email,
            professionId: null,
            feedbackNum: 0
          }, {
            login: USERS.GRADE_FEEDBACKS.login,
            email: USERS.GRADE_FEEDBACKS.email,
            professionId: null,
            feedbackNum: 0
          }, {
            login: USERS.GRADE_FEEDBACKS1.login,
            email: USERS.GRADE_FEEDBACKS1.email,
            professionId: null,
            feedbackNum: 0
          },]);
        });
    });
  });
  describe('GET admin/statistics/teacher-most-honest-student', () => {
    it('success', () => {
      return request(server)
        .get(`/admin/statistics/teacher-most-honest-student`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(5);
          expect(response.body.teacher).toEqual([{
            id: TEACHER.GULAEVA.id,
            lastName: TEACHER.GULAEVA.lastName,
            name: TEACHER.GULAEVA.name,
            middleName: TEACHER.GULAEVA.middleName,
            likes: 150
          }, {
            id: TEACHER.USHENKO.id,
            lastName: TEACHER.USHENKO.lastName,
            name: TEACHER.USHENKO.name,
            middleName: TEACHER.USHENKO.middleName,
            likes: 50
          }, {
            id: TEACHER.BOUBLIK.id,
            lastName: TEACHER.BOUBLIK.lastName,
            name: TEACHER.BOUBLIK.name,
            middleName: TEACHER.BOUBLIK.middleName,
            likes: 30
          }, {
            id: TEACHER.GORBORUKOV.id,
            lastName: TEACHER.GORBORUKOV.lastName,
            name: TEACHER.GORBORUKOV.name,
            middleName: TEACHER.GORBORUKOV.middleName,
            likes: 5
          }, {
            id: TEACHER.TOP_ECONOMIST.id,
            lastName: TEACHER.TOP_ECONOMIST.lastName,
            name: TEACHER.TOP_ECONOMIST.name,
            middleName: TEACHER.TOP_ECONOMIST.middleName,
            likes: 0
          });
        });
    });
  });
  describe('GET admin/statistics/user-rating', () => {
    it('success', () => {
      return request(server)
        .get(`/admin/statistics/user-rating`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(response => {
          expect(response.body.total).toBe(5);
          expect(response.body.user).toEqual([{
            login: USERS.ADMIN_USER.login,
            email: USERS.ADMIN_USER.email,
            role: USERS.ADMIN_USER.role,
            professionId: null,
            rating: 0,
            totalFeedbackNumber: 0
          }, {
            login: USERS.GRADE_FEEDBACKS.login,
            email: USERS.GRADE_FEEDBACKS.email,
            role: USERS.GRADE_FEEDBACKS.role,
            rating: 0,
            professionId: null,
            totalFeedbackNumber: 0
          }, {
            login: USERS.GRADE_FEEDBACKS1.login,
            email: USERS.GRADE_FEEDBACKS1.email,
            role: USERS.GRADE_FEEDBACKS1.role,
            rating: 0,
            professionId: null,
            totalFeedbackNumber: 0
          }, {
            login: USERS.SIMPLE_FGN.login,
            email: USERS.SIMPLE_FGN.email,
            role: USERS.SIMPLE_FGN.role,
            rating: 18.333333333333332,
            professionId: USERS.SIMPLE_FGN.profession.id,
            totalFeedbackNumber: 3
          }, {
            login: USERS.SIMPLE.login,
            email: USERS.SIMPLE.email,
            role: USERS.SIMPLE.role,
            rating: 32.5,
            professionId: USERS.SIMPLE.profession.id,
            totalFeedbackNumber: 4
          }]);
        });
    });
  });
});