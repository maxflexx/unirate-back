import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { BearerAuthUserMiddleware } from '../../../common/middlewares/bearer-auth-user.middleware';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthUserMiddleware)
      .forRoutes(TeacherController);
  }
}