import { Module } from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';

import {ORM_CONFIG} from './constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { TeacherModule } from './modules/teacher/teacher.module';

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG), AuthModule, UserModule, FeedbackModule, TeacherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}