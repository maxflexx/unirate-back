import { Injectable } from '@nestjs/common';
import { Feedback } from '../../entities/feedback.entity';
import { DbUtil } from '../../utils/db-util';
import { Discipline } from '../../entities/discipline.entity';
import { IsNotItemOwner, ItemNotFound } from '../../constants';
import { Teacher } from '../../entities/teacher.entity';
import { CreateFeedbackDto } from '../default-user/feedback/dto/create-feedback.dto';
import { TimeUtil } from '../../utils/time-util';
import { FeedbackResultDto } from '../default-user/feedback/dto/feedback-result.dto';
import { FeedbackGrade } from '../../entities/feedback-grade.entity';
import { GetFeedbackParamsDto } from '../default-user/feedback/dto/get-feedback-params.dto';
import { Faculty } from '../../entities/faculty.entity';

@Injectable()
export class FeedbackService {
  constructor(){}

  async getFeedback(params: GetFeedbackParamsDto): Promise<{feedback: FeedbackResultDto[], total: number}> {
    let countQuery = `SELECT COUNT(*) AS count FROM feedback`;
    let query = `SELECT f.id, f.user_login, f.student_grade, f.rating, f.comment, f.created, d.name AS discipline_name, ft.teacher_id, t.name, t.middle_name, t.last_name, d.year`;
    query += ` FROM feedback f LEFT JOIN feedback_teacher ft ON ft.feedback_id = f.id`;
    query += ` LEFT JOIN discipline d ON d.id=f.discipline_id`;
    query += ` LEFT JOIN teacher t ON t.id=ft.teacher_id`;
    if (params.disciplineId != undefined) {
      query += ` WHERE f.discipline_id=${params.disciplineId}`;
      countQuery += ` WHERE discipline_id=${params.disciplineId}`;
    }
    if (params.facultyId != undefined) {
      query += (params.disciplineId != undefined) ? ' AND ' : ' WHERE ';
      query += `${params.facultyId} IN (SELECT d.faculty_id FROM discipline d WHERE d.id=f.discipline_id)`;
      countQuery += (params.disciplineId != undefined) ? ' AND ' : ' WHERE ';
      countQuery += `${params.facultyId} IN (SELECT d.faculty_id FROM discipline d WHERE d.id=discipline_id)`;
    }
    if (params.orderBy != undefined) {
      query += ` ORDER BY f.${params.orderBy}`;
    }
    const feedback = await DbUtil.getMany(FeedbackResultDto, query);
    const total = await DbUtil.getCount(countQuery);
    return {total, feedback: this.groupFeedback(feedback)};
  }

  private groupFeedback(feedback: FeedbackResultDto[]): FeedbackResultDto[] {
    if (!feedback)
      return [];
    const feedbacks = [];
    for (const f of feedback) {
      const indexOfWritten = feedbacks.findIndex(item => item.feedbackId === f.feedbackId);
      if (indexOfWritten >= 0){
        feedbacks[indexOfWritten].teachers.push(f.teachers[0]);
      }
      else {
        feedbacks.push(f);
      }
    }
    return feedbacks;
  }

  async createFeedback(disciplineId: number, body: CreateFeedbackDto, userLogin: string) {
    console.log('Feedback comment: ' + body.comment);
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    if (body.teachersIds && body.teachersIds.length !== 0) {
      const teachers = await DbUtil.getMany(Teacher, `SELECT * FROM teacher WHERE id IN (${body.teachersIds.join(', ')})`);
      if (teachers.length !== body.teachersIds.length)
        throw ItemNotFound;
    }

    await DbUtil.insertOne(`INSERT INTO feedback (student_grade, rating, comment, created, user_login, discipline_id) VALUES
                            (${body.studentGrade || null}, 0, "${body.comment}", ${TimeUtil.getUnixTime()}, "${userLogin}", ${disciplineId});`);
    const feedback = await DbUtil.getOne(Feedback, `SELECT * FROM feedback WHERE discipline_id=${disciplineId} AND comment="${body.comment}"`)
    if (body.teachersIds && body.teachersIds.length !== 0) {
      let queryFeedbackTeacher = `INSERT INTO feedback_teacher (feedback_id, teacher_id) VALUES `;
      for (const id of body.teachersIds) {
        queryFeedbackTeacher += `(${feedback.id}, ${id}),`;
      }
      await DbUtil.insertOne(queryFeedbackTeacher.substr(0, queryFeedbackTeacher.length - 1));
    }
    return {id: +feedback.id, disciplineId: +disciplineId, comment: body.comment, rating: 0, teachers: body.teachersIds, studentGrade: body.studentGrade};
    //return {id: +feedbackId, disciplineId: +disciplineId, comment: body.comment, rating: 0, teachersIds: body.teachersIds, studentGrade: body.studentGrade};
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

    //await this.updateFeedbackRating(like, feedbackGrade);
    if (feedbackGrade) {
      if (feedbackGrade.like !== like) {
        await DbUtil.updateOne(`UPDATE feedback_grade SET ` + '`like`' + `=${like} WHERE feedback_id=${feedbackId} AND user_login="${login}"`);
        await DbUtil.updateOne(`UPDATE feedback SET rating=rating+${like} WHERE id=${feedbackId}`);
        feedbackGrade.like = like;
      }
      return feedbackGrade;
    }
    await DbUtil.updateOne(`UPDATE feedback SET rating=rating+${like} WHERE id=${feedbackId}`);
    return await DbUtil.insertOne(`INSERT INTO feedback_grade (` + '`like`' + `, feedback_id, user_login) VALUES (${like}, ${feedbackId}, "${login}")`);
    //return await DbUtil.getFeedbackGrade(FeedbackGrade, feedbackId, login);
  }

  async getFeedbackSecure(feedbackId: number): Promise<Feedback> {
    const feedback = await DbUtil.getFeedbackById(Feedback, feedbackId);
    if (!feedback)
      throw ItemNotFound;
    return feedback;
  }

  checkOwnerRights(feedbackUserLogin: string, userLogin: string) {
    if (feedbackUserLogin !== userLogin)
      throw IsNotItemOwner;
  }


  async deleteFeedbackUser(feedbackId: number, login: string): Promise<void> {
    const feedback = await this.getFeedbackSecure(feedbackId);
    this.checkOwnerRights(feedback.userLogin, login);
    await this.deleteAllFeedbackData(feedbackId);
  }

  async deleteFeedbackAdmin(feedbackId: number): Promise<void> {
    await this.getFeedbackSecure(feedbackId);
    await this.deleteAllFeedbackData(feedbackId);
  }

  async deleteAllFeedbackData(feedbackId: number): Promise<void> {
    await DbUtil.deleteOne(`DELETE FROM feedback WHERE id=${feedbackId}`);
    await DbUtil.deleteOne(`DELETE FROM feedback_grade WHERE feedback_id=${feedbackId}`);
    await DbUtil.deleteOne(`DELETE FROM feedback_teacher WHERE feedback_id=${feedbackId}`);
  }
}
