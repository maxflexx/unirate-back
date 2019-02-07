import { Controller, Get, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { Feedback } from '../../entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService){}

  @Get(':disciplineId')
  async getFeedback(@Param('disciplineId') disciplineId: number): Promise<Feedback[]> {
    return await this.feedbackService.getFeedback(disciplineId);
  }
}