import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TeacherService } from '../../services/teacher.service';
import { AdminTeacherController } from './admin-teacher.controller';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  providers: [TeacherService],
  controllers: [AdminTeacherController],
  exports: [TeacherService]
})
export class AdminTeacherModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminTeacherController);
  }
}