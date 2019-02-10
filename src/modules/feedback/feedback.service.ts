import { Injectable } from '@nestjs/common';
import { Feedback } from '../../entities/feedback.entity';
import { DbUtil } from '../../utils/db-util';
import { Discipline } from '../../entities/discipline.entity';
import { AccessDenied, IsNotItemOwner, ItemNotFound } from '../../constants';
import { Teacher } from '../../entities/teacher.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { TimeUtil } from '../../utils/time-util';
import { FeedbackResultDto } from './dto/feedback-result.dto';
import { FeedbackGrade } from '../../entities/feedback-grade.entity';
import { Db } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(){}

  async getFeedback(disciplineId: number): Promise<FeedbackResultDto[]> {
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    const feedback = await DbUtil.getMany(FeedbackResultDto, `SELECT f.id, f.user_login, f.student_grade, f.rating, f.comment, f.created, f.discipline_id, ft.teacher_id FROM feedback f LEFT JOIN feedback_teacher ft ON ft.feedback_id = f.id WHERE f.discipline_id=${disciplineId}`);
    return this.groupFeedback(feedback);
  }

  private groupFeedback(feedback: FeedbackResultDto[]): FeedbackResultDto[] {
    const result = [];
    for (const f of feedback) {
      const indexOfWritten = result.findIndex(item => item.feedbackId === f.feedbackId);
      if (indexOfWritten >= 0){
        result[indexOfWritten].teacherIds.push(f.teacherIds[0]);
      }
      else {
        result.push(f);
      }
    }
    return result;
  }

  async createFeedback(disciplineId: number, body: CreateFeedbackDto, userLogin: string) {
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    const teachers = await DbUtil.getMany(Teacher, `SELECT * FROM teacher WHERE id IN (${body.teachersIds.join(', ')})`);
    if (teachers.length !== body.teachersIds.length)
      throw ItemNotFound;

    const feedbackId = await DbUtil.insertOne(`INSERT INTO feedback (student_grade, rating, comment, created, updated, user_login, discipline_id) VALUES
                            (${body.studentGrade || null}, 0, "${body.comment}", ${TimeUtil.getUnixTime()}, 0, "${userLogin}", ${disciplineId});`);
    let queryFeedbackTeacher = `INSERT INTO feedback_teacher (feedback_id, teacher_id) VALUES `;
    for (const id of body.teachersIds) {
      queryFeedbackTeacher += `(${feedbackId}, ${id}),`;
    }
    await DbUtil.insertOne(queryFeedbackTeacher.substr(0, queryFeedbackTeacher.length - 1));
    return {id: +feedbackId, disciplineId: +disciplineId, comment: body.comment, rating: 0, teachersIds: body.teachersIds, studentGrade: body.studentGrade};
  }

  async updateFeedbackRating(like: number, feedbackGrade: FeedbackGrade): Promise<void> {
    if (feedbackGrade && feedbackGrade.like === like) {
      return;
    }
    await DbUtil.updateOne(`UPDATE feedback SET rating=rating${like === 1 ? '+' : '-'}1`);
  }

  async gradeFeedback(feedbackId: number, login: string, like: number): Promise<FeedbackGrade> {
    const feedback = await DbUtil.getFeedbackById(Feedback, feedbackId);
    if (!feedback)
      throw ItemNotFound;
    const feedbackGrade = await DbUtil.getFeedbackGrade(FeedbackGrade, feedbackId, login);
    await this.updateFeedbackRating(like, feedbackGrade);
    if (feedbackGrade) {
      if (feedbackGrade.like !== like) {
        await DbUtil.updateOne(`UPDATE feedback_grade SET like=${like} WHERE user_login="${login}" AND feedback_id=${feedbackId}`);
        feedbackGrade.like = like;
      }
      return feedbackGrade;
    }
    await DbUtil.insertOne(`INSERT INTO feedback_grade (like, feedback_id, user_login) VALUES (${like}, ${feedbackId}, "${login}")`);
    return await DbUtil.getFeedbackGrade(FeedbackGrade, feedbackId, login);
  }

  async deleteFeedback(feedbackId: number, login: string): Promise<void> {
    const feedback = await DbUtil.getFeedbackById(Feedback, feedbackId);
    if (!feedback)
      throw ItemNotFound;
    if (feedback.userLogin !== login)
      throw IsNotItemOwner;
    await DbUtil.deleteOne(`DELETE FROM feedback WHERE id=${feedbackId}`);
    await DbUtil.deleteOne(`DELETE FROM feedback_grade WHERE feedback_id=${feedbackId}`);
  }
}