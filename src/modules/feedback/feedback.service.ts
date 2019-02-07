import { Injectable } from '@nestjs/common';
import { Feedback } from '../../entities/feedback.entity';
import { DbUtil } from '../../utils/db-util';

@Injectable()
export class FeedbackService {
  constructor(){}

  async getFeedback(disciplineId: number): Promise<Feedback[]> {
    return await DbUtil.getMany(Feedback, `SELECT * FROM feedback WHERE discipline_id=${disciplineId}`);
  }
}