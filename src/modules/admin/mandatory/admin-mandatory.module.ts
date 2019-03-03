import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MandatoryService } from '../../services/mandatory.service';
import { AdminMandatoryController } from './admin-mandatory.controller';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  providers: [MandatoryService],
  controllers: [AdminMandatoryController],
  exports: [MandatoryService]
})
export class AdminMandatoryModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminMandatoryController);
  }
}