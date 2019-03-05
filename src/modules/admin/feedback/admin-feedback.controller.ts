import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { FeedbackService } from '../../services/feedback.service';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';
import { FeedbackResultDto } from '../../default-user/feedback/dto/feedback-result.dto';
import { STATUS_OK } from '../../../constants';
import { GetFeedbackParamsDto } from '../../default-user/feedback/dto/get-feedback-params.dto';

@Controller('admin/feedback')
export class AdminFeedbackController {
  constructor(private readonly feedbackService: FeedbackService){}

  @Get()
  async getFeedbackAdmin(@Query() params: GetFeedbackParamsDto): Promise<{feedback: FeedbackResultDto[], total: number}> {
    return await this.feedbackService.getFeedback(params);
  }

  @Delete(':feedbackId')
  async deleteFeedbackAdmin(@Param('feedbackId', new ParseIntPipe()) feedbackId: number): Promise<string> {
    await this.feedbackService.deleteFeedbackAdmin(feedbackId);
    return STATUS_OK;
  }
}