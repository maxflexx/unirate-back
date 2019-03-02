import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { AdminUserController } from './admin-user.controller';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  providers: [UserService],
  controllers: [AdminUserController],
  exports: [UserService]
})
export class AdminUserModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminUserController);
  }
}