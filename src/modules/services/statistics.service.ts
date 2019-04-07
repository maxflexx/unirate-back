import { Injectable } from '@nestjs/common';
import { Faculty } from '../../entities/faculty.entity';
import { DbUtil } from '../../utils/db-util';
import { Profession } from '../../entities/profession.entity';
import { Teacher } from '../../entities/teacher.entity';
import { PopularTeachersDto } from '../admin/statistics/dto/popular-teachers.dto';
import { ActiveUsersDto } from '../admin/statistics/dto/active-users.dto';
import { TeachersWithMostHonestStudentsDto } from '../admin/statistics/dto/teachers-with-most-honest-students.dto';
import { UserRatingDto } from '../admin/statistics/dto/user-rating.dto';
import { PagingDto } from '../../common/dto/paging.dto';
import { ProfessionStatisticsDto } from '../admin/user/dto/profession-statistics.dto';

@Injectable()
export class StatisticsService {

  constructor(){}

  //professions where all mandatory disciplines has feedback
  async getStatisticsProfession(params: PagingDto): Promise<{total: number, profession: Profession[]}> {
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
                     'WHERE mm.profession_id=pr.id)' +
                `LIMIT ${params.limit} OFFSET ${params.offset}`;
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
      return {total: await DbUtil.getCount(countQuery), profession: await DbUtil.getMany(Profession, query)};
  }

  async getPopularTeachers(params: PagingDto): Promise<{total: number, teacher: Teacher[]}> {
    const query = 'SELECT t.id, t.`name`, t.last_name, t.middle_name, COUNT(DISTINCT ft.feedback_id) AS feedbackNum ' +
                  'FROM teacher t ' +
                  'LEFT JOIN feedback_teacher ft ON ft.teacher_id = t.id ' +
                  'GROUP BY t.id ' +
                  'ORDER BY feedbackNum DESC ' +
                  `LIMIT ${params.limit} OFFSET ${params.offset}`;
    const countQuery = 'SELECT COUNT(DISTINCT t.id) AS count ' +
                       'FROM teacher t, feedback_teacher ft ' +
                       'WHERE t.id=ft.teacher_id ';
    return {total: await DbUtil.getCount(countQuery), teacher: await DbUtil.getMany(PopularTeachersDto, query)};

  }

  async getMostActiveUsers(params: PagingDto): Promise<{total: number, user: ActiveUsersDto[]}> {
    const query = 'SELECT u.login, u.email, u.profession_id, COUNT(DISTINCT feed.id) AS feedbackNum ' +
                  'FROM user u ' +
                  'LEFT JOIN feedback feed ON feed.user_login=u.login ' +
                  'GROUP BY u.login ' +
                  'ORDER BY feedbackNum DESC ' +
                  `LIMIT ${params.limit} OFFSET ${params.offset}`;
    const countQuery = 'SELECT COUNT(DISTINCT u.login) AS count ' +
                        'FROM user u ' +
                        'LEFT JOIN feedback feed ON feed.user_login=u.login';
    return {total: await DbUtil.getCount(countQuery), user: await DbUtil.getMany(ActiveUsersDto, query)};
  }

  async getTeachersWithMostHonestStudents(params: PagingDto): Promise<{total: number, teacher: TeachersWithMostHonestStudentsDto[]}> {
    const query = 'SELECT t.id, t.last_name, t.`name`, t.middle_name, COALESCE(SUM(feed.rating), 0) AS likes ' +
                  'FROM teacher t ' +
                  'LEFT JOIN feedback_teacher ft ON ft.teacher_id=t.id ' +
                  'LEFT JOIN feedback feed ON feed.id=ft.feedback_id ' +
                  'GROUP BY t.id ' +
                  'ORDER BY likes DESC ' +
                  `LIMIT ${params.limit} OFFSET ${params.offset}`;
    const countQuery = 'SELECT COUNT(DISTINCT t.id) AS count ' +
      'FROM teacher t ' +
      'LEFT JOIN feedback_teacher ft ON ft.teacher_id=t.id ' +
      'LEFT JOIN feedback feed ON feed.id=ft.feedback_id ';
    return await {total: await DbUtil.getCount(countQuery), teacher: await DbUtil.getMany(TeachersWithMostHonestStudentsDto, query)};
  }

  async getUsersRating(params: PagingDto): Promise<{total: number, user: UserRatingDto[]}> {
    const query = 'SELECT u.login, u.email, u.profession_id, u.role, COALESCE(AVG(f.rating), 0) AS rating, COUNT(f.id) totalFeedbackNumber ' +
                  'FROM user u ' +
                  'LEFT JOIN feedback f ON f.user_login=u.login ' +
                  'GROUP BY u.login ' +
                  'ORDER BY rating ' +
                  `LIMIT ${params.limit} OFFSET ${params.offset}`;

    const countQuery = 'SELECT COUNT(DISTINCT u.login) AS count ' +
                        'FROM user u ' +
                        'LEFT JOIN feedback f ON f.user_login=u.login ';
    return {total: await DbUtil.getCount(countQuery), user: await DbUtil.getMany(UserRatingDto, query)};
  }

  async getMostActiveProfession(params: PagingDto): Promise<{total: number, profession: ProfessionStatisticsDto[]}> {
    const query = 'SELECT pr.id, pr.`name`, pr.faculty_id, COALESCE(COUNT(f.id), 0) AS total_feedback ' +
                  'FROM profession pr ' +
                  'LEFT JOIN user u ON pr.id=u.profession_id ' +
                  'LEFT JOIN feedback f ON f.user_login=u.login ' +
                  'GROUP BY pr.id ' +
                  'ORDER BY total_feedback DESC ' +
                  `LIMIT ${params.limit} OFFSET ${params.offset}`;
    const countQuery = 'SELECT COUNT(DISTINCT pr.id) AS count ' +
                       'FROM profession pr';
    return {total: await DbUtil.getCount(countQuery), profession: await DbUtil.getMany(ProfessionStatisticsDto, query)};
  }

}