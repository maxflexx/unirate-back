import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminProfessionController } from './admin-profession.controller';
import { ProfessionService } from '../../services/profession.service';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  controllers: [AdminProfessionController],
  providers: [ProfessionService],
  exports: [ProfessionService]
})
export class AdminProfessionModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminProfessionController);
  }
}