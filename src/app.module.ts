import { Module } from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';

import {ORM_CONFIG} from './constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/default-user/user/user.module';
import { FeedbackModule } from './modules/default-user/feedback/feedback.module';
import { TeacherModule } from './modules/default-user/teacher/teacher.module';
import { AdminFeedbackModule } from './modules/admin/feedback/admin-feedback.module';
import { AdminDisciplineModule } from './modules/admin/discipline/admin-discipline.module';

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG), AuthModule, UserModule, FeedbackModule, TeacherModule, AdminFeedbackModule, AdminDisciplineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}