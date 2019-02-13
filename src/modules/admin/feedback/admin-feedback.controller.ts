import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FeedbackService } from '../../services/feedback.service';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';
import { FeedbackResultDto } from '../../default-user/feedback/dto/feedback-result.dto';
import { STATUS_OK } from '../../../constants';

@Controller('admin/feedback')
export class AdminFeedbackController {
  constructor(private readonly feedbackService: FeedbackService){}

  @Get(':disciplineId')
  async getFeedbackAdmin(@Param('disciplineId', new ParseIntPipe()) disciplineId: number): Promise<FeedbackResultDto[]> {
    return await this.feedbackService.getFeedback(disciplineId);
  }

  @Delete(':feedbackId')
  async deleteFeedbackAdmin(@Param('feedbackId', new ParseIntPipe()) feedbackId: number): Promise<string> {
    await this.feedbackService.deleteFeedbackAdmin(feedbackId);
    return STATUS_OK;
  }
}