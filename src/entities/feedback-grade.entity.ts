import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feedback_grade')
export class FeedbackGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  like: number;

  @Column({name: 'feedback_id'})
  feedbackId: number;

  @Column({name: 'user_login'})
  userLogin: string;

  static fromRaw(raw: any): FeedbackGrade {
    const entity = new FeedbackGrade();
    entity.id = +raw.id;
    entity.like = raw.like;
    entity.feedbackId = +raw.feedback_id;
    entity.userLogin = raw.user_login;
    return entity;
  }
}