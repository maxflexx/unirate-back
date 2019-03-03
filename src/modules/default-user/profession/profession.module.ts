import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BearerAuthUserMiddleware } from '../../../common/middlewares/bearer-auth-user.middleware';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from '../../services/profession.service';

@Module({
  controllers: [ProfessionController],
  providers: [ProfessionService],
  exports: [ProfessionService],
})
export class ProfessionModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BearerAuthUserMiddleware)
      .forRoutes(ProfessionController);
  }
}