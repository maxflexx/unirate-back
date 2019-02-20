import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminFacultyController } from './admin-faculty.controller';
import { FacultyService } from '../../services/faculty.service';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  controllers: [AdminFacultyController],
  providers: [FacultyService],
  exports: [FacultyService]
})
export class AdminFacultyModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminFacultyController);
  }
}