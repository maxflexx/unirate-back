import { Injectable } from '@nestjs/common';
import { Feedback } from '../../entities/feedback.entity';
import { DbUtil } from '../../utils/db-util';
import { Discipline } from '../../entities/discipline.entity';
import { ItemNotFound } from '../../constants';
import { Teacher } from '../../entities/teacher.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { TimeUtil } from '../../utils/time-util';

@Injectable()
export class FeedbackService {
  constructor(){}

  async getFeedback(disciplineId: number): Promise<Feedback[]> {
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    return await DbUtil.getMany(Feedback, `SELECT *, (SELECT SUM(like) FROM feedback_grade) AS feedbackGrade FROM feedback feedback_teacher WHERE discipline_id=${disciplineId}`);
  }

  async createFeedback(disciplineId: number, body: CreateFeedbackDto, userLogin: string) {
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    const teachers = await DbUtil.getMany(Teacher, `SELECT * FROM teacher WHERE id IN (${body.teachersIds.join(', ')})`);
    if (teachers.length !== body.teachersIds.length)
      throw ItemNotFound;

    const feedbackId = await DbUtil.insertOne(`INSERT INTO feedback (student_grade, rating, comment, created, updated, user_login, discipline_id) VALUES
                            (${body.studentGrade || null}, 0, ${body.comment}, ${TimeUtil.getUnixTime()}, null, "${userLogin}", ${disciplineId});`);
    let queryFeedbackTeacher = `INSERT feedback_teacher (feedback_id, teacher_id) `;
    for (const id of body.teachersIds) {
      queryFeedbackTeacher += `VALUES (${feedbackId}, ${id}),`;
    }
    await DbUtil.insertOne(queryFeedbackTeacher.substr(0, queryFeedbackTeacher.length - 1));
    return {id: feedbackId, disciplineId, comment: body.comment, like: 0, teacherIds: body.teachersIds, studentGrade: body.studentGrade};
  }
}