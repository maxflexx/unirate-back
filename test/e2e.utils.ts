import * as fs from "fs";
import {ValidationPipe} from '../src/common/pipes/validation.pipe';
import {ORM_CONFIG_MEMORY} from '../src/constants';
import {Test} from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import {AppModule} from '../src/app.module';

export async function initTestApp(server) {
  const ORM_CONFIG = ORM_CONFIG_MEMORY;

  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(ORM_CONFIG), AppModule],
  }).compile();

  const app = module.createNestApplication(server);
  app.useGlobalPipes(new ValidationPipe());

  const scripts = [
    // 'triggers-sqlite.sql'
  ];

  await app.init();

  const connection = await getConnection(ORM_CONFIG.name);

  scripts.forEach(async element => {
    const content = String((fs as any).readFileSync(__dirname + '/../scripts/' + element));
    const statements = content.split('END;');
    if (statements.length === 1) {
      await connection.query(content);
    } else {
      statements.forEach(async statement => {
        const trimmed = statement.trim();
        if (trimmed.length > 0) {
          await connection.query(trimmed + 'END;');
        }
      });
    }
  });

  return connection;
}