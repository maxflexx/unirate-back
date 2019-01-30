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
}