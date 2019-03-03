import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BearerAuthUserMiddleware } from '../../../common/middlewares/bearer-auth-user.middleware';
import { FacultyController } from './faculty.controller';
import { FacultyService } from '../../services/faculty.service';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthUserMiddleware)
      .forRoutes(FacultyController);
  }
}