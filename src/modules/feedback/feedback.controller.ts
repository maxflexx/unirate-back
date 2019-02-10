import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { User } from '../../entities/user.entity';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { FeedbackResultDto } from './dto/feedback-result.dto';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { FeedbackGrade } from '../../entities/feedback-grade.entity';
import { GradeFeedbackDto } from './dto/grade-feedback.dto';
import { STATUS_OK } from '../../constants';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService){}

  @Get(':disciplineId')
  async getFeedback(@Param('disciplineId', new ParseIntPipe()) disciplineId: number): Promise<FeedbackResultDto[]> {
    return await this.feedbackService.getFeedback(+disciplineId);
  }

  @Post(':disciplineId')
  async createFeedback(@Body() body: CreateFeedbackDto, @Param('disciplineId', new ParseIntPipe()) disciplineId: number, @UserDecorator() user: User) {
    return await this.feedbackService.createFeedback(disciplineId, body, user.login);
  }

  @Post('grade/:feedbackId')
  async gradeFeedback(@Param('feedbackId', new ParseIntPipe()) feedbackId: number, @UserDecorator() user: User, @Body() body: GradeFeedbackDto): Promise<FeedbackGrade> {
    return await this.feedbackService.gradeFeedback(feedbackId, user.login, body.like);
  }

  @Delete(':feedbackId')
  async deleteFeedback(@Param('feedbackId', new ParseIntPipe()) feedbackId: number, @UserDecorator() user: User): Promise<string> {
    await this.feedbackService.deleteFeedback(feedbackId, user.login);
    return STATUS_OK;
  }
}