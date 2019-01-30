import { PrimaryColumn } from 'typeorm';

export class FeedbackTeacher {
  @PrimaryColumn({name: 'feedback_id'})
  feedbackId: number;

  @PrimaryColumn({name: 'teacher_id'})
  teacherId: number;
}