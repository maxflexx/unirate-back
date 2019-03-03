import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BearerAuthUserMiddleware } from '../../../common/middlewares/bearer-auth-user.middleware';
import { DisciplineController } from './discipline.controller';
import { DisciplineService } from '../../services/discipline.service';

@Module({
  controllers: [DisciplineController],
  providers: [DisciplineService],
  exports: [DisciplineService],
})
export class DisciplineModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthUserMiddleware)
      .forRoutes(DisciplineController);
  }
}