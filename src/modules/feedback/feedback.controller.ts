import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from '../../entities/feedback.entity';
import { InvalidParams } from '../../constants';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { User } from '../../entities/user.entity';
import { UserDecorator } from '../../common/decorators/user.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService){}

  @Get(':disciplineId')
  async getFeedback(@Param('disciplineId') disciplineId: number): Promise<Feedback[]> {
    if (isNaN(+disciplineId))
      throw InvalidParams;
    return await this.feedbackService.getFeedback(disciplineId);
  }

  @Post(':disciplineId')
  async createFeedback(@Body() body: CreateFeedbackDto, @Param('disciplineId') disciplineId: number, @UserDecorator() user: User) {
    if (isNaN(+disciplineId))
      throw InvalidParams;
    return await this.feedbackService.createFeedback(disciplineId, body, user.login);
  }
}