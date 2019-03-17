import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeUtil } from '../utils/time-util';
import { CreateFeedbackDto } from '../modules/default-user/feedback/dto/create-feedback.dto';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'student_grade', nullable: true})
  studentGrade: number;

  @Column()
  rating: number;

  @Column()
  comment: number;

  @Column()
  created: number = TimeUtil.getUnixTime();

  @Column({name: 'user_login'})
  userLogin: string;

  @Column({name: 'discipline_id'})
  disciplineId: number;

  static fromRaw(raw: any): Feedback {
    const entity = new Feedback();
    entity.id = +raw.id;
    entity.studentGrade = raw.student_grade;
    entity.rating = raw.rating;
    entity.comment = raw.comment;
    entity.created = raw.created;
    entity.updated = raw.updated || null;
    entity.userLogin = raw.user_login;
    entity.disciplineId = +raw.discipline_id;
    return entity;
  }
}