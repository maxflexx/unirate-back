import { Injectable } from '@nestjs/common';
import { Faculty } from '../../entities/faculty.entity';
import { DbUtil } from '../../utils/db-util';
import { Profession } from '../../entities/profession.entity';
import { Teacher } from '../../entities/teacher.entity';
import { PopularTeachersDto } from '../admin/statistics/dto/popular-teachers.dto';
import { ActiveUsersDto } from '../admin/statistics/dto/active-users.dto';
import { TeachersWithMostHonestStudentsDto } from '../admin/statistics/dto/teachers-with-most-honest-students.dto';
import { UserRatingDto } from '../admin/statistics/dto/user-rating.dto';

@Injectable()
export class StatisticsService {

  constructor(){}

  //professions where all mandatory disciplines has feedback
  async getStatisticsProfession(): Promise<{total: number, professions: Profession[]}> {
    const query = 'SELECT * ' +
                'FROM profession pr ' +
                'WHERE NOT EXISTS (SELECT * ' +
                                  'FROM mandatory m ' +
                                  'WHERE m.profession_id=pr.id AND ' +
                                  'NOT EXISTS (SELECT * ' +
                                              'FROM feedback f ' +
                                              'WHERE f.discipline_id=m.discipline_id)) ' +
                'AND (SELECT COUNT(DISTINCT mm.discipline_id) ' +
                     'FROM mandatory mm ' +
                     'WHERE mm.profession_id=pr.id)';
    const countQuery =  'SELECT COUNT(pr.id) AS count ' +
      'FROM profession pr ' +
      'WHERE NOT EXISTS (SELECT * ' +
      'FROM mandatory m ' +
      'WHERE m.profession_id=pr.id AND ' +
      'NOT EXISTS (SELECT * ' +
      'FROM feedback f ' +
      'WHERE f.discipline_id=m.discipline_id)) ' +
      'AND (SELECT COUNT(DISTINCT mm.discipline_id) ' +
      'FROM mandatory mm ' +
      'WHERE mm.profession_id=pr.id)';
      return {total: await DbUtil.getCount(countQuery), professions: await DbUtil.getMany(Profession, query)};
  }

  async getPopularTeachers(): Promise<{total: number, teachers: Teacher[]}> {
    const query = 'SELECT *, COUNT(DISTINCT ft.feedback_id) AS feedbackNum ' +
                  'FROM teacher t, feedback_teacher ft ' +
                  'WHERE t.id=ft.teacher_id ' +
                  'GROUP BY t.id ' +
                  'ORDER BY feedbackNum DESC';
    const countQuery = 'SELECT COUNT(DISTINCT t.id) AS count ' +
                       'FROM teacher t, feedback_teacher ft ' +
                       'WHERE t.id=ft.teacher_id ';
    return {total: await DbUtil.getCount(countQuery), teachers: await DbUtil.getMany(PopularTeachersDto, query)};

  }

  async getMostActiveUsers(): Promise<{total: number, users: ActiveUsersDto[]}> {
    const query = 'SELECT u.login, u.email, u.profession_id, COUNT(DISTINCT feed.id) AS feedbackNum ' +
                  'FROM user u ' +
                  'LEFT JOIN feedback feed ON feed.user_login=u.login ' +
                  'GROUP BY u.login ' +
                  'ORDER BY feedbackNum DESC';
    const countQuery = 'SELECT COUNT(DISTINCT u.login) AS count ' +
                        'FROM user u ' +
                        'LEFT JOIN feedback feed ON feed.user_login=u.login';
    return {total: await DbUtil.getCount(countQuery), users: await DbUtil.getMany(ActiveUsersDto, query)};
  }

  async getTeachersWithMostHonestStudents(): Promise<{total: number, teachers: TeachersWithMostHonestStudentsDto[]}> {
    const query = 'SELECT t.id, t.last_name, t.name, t.middle_name, COALESCE(SUM(fg.like), 0) AS likes ' +
                  'FROM feedback feed, feedback_teacher ft, feedback_grade fg, teacher t ' +
                  'WHERE feed.id=ft.feedback_id AND ' +
                  'feed.id=fg.feedback_id AND ' +
                  't.id=ft.teacher_id ' +
                  'GROUP BY t.id ' +
                  'ORDER BY likes DESC';
    const countQuery = 'SELECT COUNT(DISTINCT t.id) AS count ' +
                       'FROM feedback feed, feedback_teacher ft, feedback_grade fg, teacher t ' +
                       'WHERE feed.id=ft.feedback_id AND ' +
                       'feed.id=fg.feedback_id AND ' +
                       't.id=ft.teacher_id ';
    return await {total: await DbUtil.getCount(countQuery), teachers: await DbUtil.getMany(TeachersWithMostHonestStudentsDto, query)};
  }

  async getUsersRating(): Promise<{total: number, users: UserRatingDto[]}> {
    const query = 'SELECT u.login, u.email, u.profession_id, u.role, COALESCE(AVG(f.rating), 0) AS rating, COUNT(f.id) totalFeedbackNumber ' +
                  'FROM user u ' +
                  'LEFT JOIN feedback f ON f.user_login=u.login ' +
                  'GROUP BY u.login';

    const countQuery = 'SELECT COUNT(DISTINCT u.login) AS count ' +
                        'FROM user u ' +
                        'LEFT JOIN feedback f ON f.user_login=u.login ';
    return {total: await DbUtil.getCount(countQuery), users: await DbUtil.getMany(UserRatingDto, query)};
  }
}