import express from 'express';
import { Connection } from 'typeorm';
import { createTestData, initTestApp, testAdminAuth } from '../../e2e.utils';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { ADMINS_JWT, DISCIPLINE, MANDATORY, PROFESSIONS } from '../../e2e.constants';
import request from 'supertest';
import { DbUtil } from '../../../src/utils/db-util';
import { Mandatory } from '../../../src/entities/mandatory.entity';
import { ITEM_ALREADY_EXISTS, ITEM_NOT_FOUND } from '../../../src/constants';

describe('Admin Mandatory', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });
  describe('POST admin/discipline/mandatory', () => {
    testAdminAuth(server, RequestMethod.POST, `/admin/discipline/mandatory`);
    it('success', () => {
      const body = {disciplineId: DISCIPLINE.ENGLISH.id, professionId: PROFESSIONS.APPLIED_MATH.id};
      return request(server)
        .post(`/admin/discipline/mandatory`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          expect(response.body).toEqual(body);
          const mandatory = await DbUtil.getMandatoryByDisciplineAndProfession(Mandatory, body.professionId, body.disciplineId);
          expect(mandatory).toEqual(body);
        });
    });
    it('fail: discipline does not exist', () => {
      const body = {disciplineId: 9999, professionId: PROFESSIONS.APPLIED_MATH.id};
      return request(server)
        .post(`/admin/discipline/mandatory`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: profession does not exist', () => {
      const body = {disciplineId: DISCIPLINE.ECONOMICS.id, professionId: 9999};
      return request(server)
        .post(`/admin/discipline/mandatory`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.NOT_FOUND)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_NOT_FOUND);
        });
    });
    it('fail: already exists', () => {
      const body = {disciplineId: DISCIPLINE.ECONOMICS.id, professionId: PROFESSIONS.ECONOMIST.id};
      return request(server)
        .post(`/admin/discipline/mandatory`)
        .send(body)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.CONFLICT)
        .then(async response => {
          expect(response.body.error).toBe(ITEM_ALREADY_EXISTS);
        });
    });
  });
  describe('DELETE admin/discipline/mandatory', () => {
    it('success: one', () => {
    return request(server)
      .delete(`/admin/discipline/mandatory`)
      .query(`disciplineId=${MANDATORY.SE_OBDS.discipline.id}&professionId=${MANDATORY.SE_OBDS.profession.id}`)
      .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
      .expect(HttpStatus.OK)
      .then(async response => {
        const mandatory = await DbUtil.getMandatoryByDisciplineAndProfession(Mandatory, MANDATORY.SE_OBDS.profession.id, MANDATORY.SE_OBDS.discipline.id);
        expect(mandatory).toBe(null);
      });
    });
    it('success: by discipline', () => {
      return request(server)
        .delete(`/admin/discipline/mandatory`)
        .query(`disciplineId=${MANDATORY.ENGLISH_ECONOMICS.discipline.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const mandatory = await DbUtil.getMandatoryByDisciplineId(Mandatory, MANDATORY.ENGLISH_ECONOMICS.discipline.id);
          expect(mandatory).toBe(null);
        });
    });
    it('success: by profession', () => {
      return request(server)
        .delete(`/admin/discipline/mandatory`)
        .query(`professionId=${MANDATORY.SE_OOP.profession.id}`)
        .set('Authorization', 'Bearer ' + ADMINS_JWT.SIMPLE)
        .expect(HttpStatus.OK)
        .then(async response => {
          const mandatory = await DbUtil.getMandatoryByProfessionId(Mandatory, MANDATORY.SE_OOP.profession.id);
          expect(mandatory).toBe(null);
        });
    });
  });
});