import request from 'supertest';
import express from 'express';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import {initTestApp} from './e2e.utils';
import {Connection} from '../node_modules/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const server = express();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  let db: Connection;
  beforeAll(async () => {
    // const moduleFixture = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();
    //
    // app = moduleFixture.createNestApplication();
    // await app.init();
    db = await initTestApp(server);
  });

  it('/GET /', () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});