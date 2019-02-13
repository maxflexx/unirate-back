import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminFeedbackController } from './admin-feedback.controller';
import { BearerAuthAdminMiddleware } from '../../../common/middlewares/bearer-auth-admin.middleware';
import { FeedbackService } from '../../services/feedback.service';

@Module({
  providers: [FeedbackService],
  controllers: [AdminFeedbackController],
  exports: [FeedbackService],
})
export class AdminFeedbackModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthAdminMiddleware)
      .forRoutes(AdminFeedbackController);
  }
}