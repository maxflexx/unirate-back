import { PrimaryColumn } from 'typeorm';

export class FeedbackTeacher {
  @PrimaryColumn({name: 'feedback_id'})
  feedbackId: number;

  @PrimaryColumn({name: 'teacher_id'})
  teacherId: number;

  static fromRaw(raw: any): FeedbackTeacher {
    const entity = new FeedbackTeacher();
    entity.feedbackId = +raw.feedback_id;
    entity.teacherId = +raw.teacher_id;
    return entity;
  }
}