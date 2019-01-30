import request from 'supertest';
import express from 'express';
import { createTestData, initTestApp } from './e2e.utils';
import {Connection} from 'typeorm';

describe('AppController (e2e)', () => {
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    db = await initTestApp(server);
    await createTestData();
  });

  it('/GET /', () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});