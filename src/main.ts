import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { LISTEN_PORT } from './constants';
import { ValidationPipe } from './common/pipes/validation.pipe';


async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, server, {cors: true});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(LISTEN_PORT);
}
bootstrap();