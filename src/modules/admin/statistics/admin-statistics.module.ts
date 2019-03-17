import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminStatisticsController } from './admin-statistics.controller';
import { StatisticsService } from '../../services/statistics.service';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';

@Module({
  controllers: [AdminStatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService]
})
export class AdminStatisticsModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminStatisticsController);
  }
}