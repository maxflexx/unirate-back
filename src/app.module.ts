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
import { AdminFacultyModule } from './modules/admin/faculty/admin-faculty.module';
import { AdminProfessionModule } from './modules/admin/profession/admin-profession.module';
import { AdminUserModule } from './modules/admin/user/admin-user.module';
import { AdminMandatoryModule } from './modules/admin/mandatory/admin-mandatory.module';
import { AdminTeacherModule } from './modules/admin/teacher/admin-teacher.module';
import { FacultyModule } from './modules/default-user/faculty/faculty.module';
import { ProfessionModule } from './modules/default-user/profession/profession.module';
import { DisciplineModule } from './modules/default-user/discipline/discipline.module';
import { AdminStatisticsController } from './modules/admin/statistics/admin-statistics.controller';
import { AdminStatisticsModule } from './modules/admin/statistics/admin-statistics.module';

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG), AuthModule, UserModule, FeedbackModule, TeacherModule, AdminFeedbackModule, AdminDisciplineModule, AdminFacultyModule, AdminProfessionModule, AdminUserModule, AdminMandatoryModule, AdminTeacherModule, FacultyModule, ProfessionModule, DisciplineModule, AdminStatisticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}