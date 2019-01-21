import { Module } from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';

import {ORM_CONFIG} from './constants';
import {QueryRunner, Logger} from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}