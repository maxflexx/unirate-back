import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { TimeUtil } from '../../utils/time-util';

export class FeedbackClientDto {
  id: number;

  studentGrade: number;

  rating: number;

  comment: number;

  created: number;

  userLogin: string;

  disciplineName: string;

  static fromRaw(raw: any): FeedbackClientDto {
    const entity = new FeedbackClientDto();
    entity.id = +raw.id;
    entity.studentGrade = raw.student_grade;
    entity.rating = raw.rating;
    entity.comment = raw.comment;
    entity.created = raw.created;
    entity.userLogin = raw.user_login;
    entity.disciplineName = raw.disciplineName;
    return entity;
  }
}