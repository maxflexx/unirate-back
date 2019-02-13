import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DisciplineService } from '../../services/discipline.service';
import { AdminDisciplineController } from './admin-discipline.controller';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  providers: [DisciplineService],
  controllers: [AdminDisciplineController],
  exports: [DisciplineService]
})
export class AdminDisciplineModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware).forRoutes(AdminDisciplineController);
  }
}