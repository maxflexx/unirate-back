import { MiddlewareConsumer, Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from '../../services/feedback.service';
import { BearerAuthUserMiddleware } from '../../../common/middlewares/bearer-auth-user.middleware';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthUserMiddleware)
      .forRoutes(FeedbackController);
  }
}