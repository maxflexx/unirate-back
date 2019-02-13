import { Injectable } from '@nestjs/common';
import { GetAdminDisciplineParamsDto } from '../admin/discipline/dto/get-admin-discipline-params.dto';
import { Discipline } from '../../entities/discipline.entity';
import { DbUtil } from '../../utils/db-util';
import { CreateDisciplineDto } from '../admin/discipline/dto/create-discipline.dto';
import { Faculty } from '../../entities/faculty.entity';
import { ItemNotFound } from '../../constants';
import { UpdateDisciplineDto } from '../admin/discipline/dto/update-discipline.dto';
import { Feedback } from '../../entities/feedback.entity';
import { FeedbackTeacher } from '../../entities/feedback-teacher.entity';
import { FeedbackGrade } from '../../entities/feedback-grade.entity';

@Injectable()
export class DisciplineService {
  constructor(){}

  async getDisciplinesAdmin(params: GetAdminDisciplineParamsDto): Promise<{disciplines: Discipline[], total: number}> {
    let query = `SELECT * FROM discipline `;
    if (params.facultyId != undefined || params.id != undefined || params.year != undefined) {
      query += 'WHERE ';
      const queryParams = [];
      if (params.facultyId != undefined) {
        queryParams.push(`faculty_id = ${params.facultyId}`);
      }
      if (params.id != undefined) {
        queryParams.push(`id = ${params.id}`);
      }
      if (params.year) {
        queryParams.push(`year = ${params.year}`);
      }
      query += queryParams.join(' AND ');
    }
    const queryWithLimits = query + ` LIMIT ${params.limit} OFFSET ${params.offset}`;
    const disciplines = await DbUtil.getMany(Discipline, queryWithLimits);
    const countHowMany = await DbUtil.getMany(Discipline, query);
    return {disciplines, total: countHowMany.length};
  }

  async createDisciplineAdmin(body: CreateDisciplineDto): Promise<Discipline> {
    const faculty = await DbUtil.getFacultyById(Faculty, body.facultyId);
    if (!faculty)
      throw ItemNotFound;
    const id = +(await DbUtil.insertOne(`INSERT INTO discipline(name, mandatory, year, faculty_id) VALUES
    ("${body.name}", ${body.mandatory}, ${body.year}, ${body.facultyId})`));
    return await DbUtil.getDisciplineById(Discipline, id);
  }

  async updateDisciplineAdmin(disciplineId: number, body: UpdateDisciplineDto): Promise<Discipline> {
    if (body.facultyId != undefined) {
      const faculty = await DbUtil.getFacultyById(Faculty, body.facultyId);
      if (!faculty)
        throw ItemNotFound;
    }
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    discipline.updateAdmin(body);
    await DbUtil.insertOne(`UPDATE discipline SET name="${discipline.name}", mandatory=${discipline.mandatory}, year=${discipline.year}, faculty_id=${discipline.facultyId} WHERE id=${disciplineId}`);
    return await DbUtil.getDisciplineById(Discipline, disciplineId);
  }

  async deleteDisciplineAdmin(disciplineId: number): Promise<void> {
    const query = `DELETE discipline, feedback, feedback_grade, feedback_teacher FROM discipline
                   LEFT JOIN feedback ON feedback.discipline_id = discipline.id
                   LEFT JOIN feedback_grade ON feedback.id = feedback_grade.feedback_id
                   LEFT JOIN feedback_teacher ON feedback.id = feedback_teacher.feedback_id
                   WHERE discipline.id=${disciplineId}`;
    await DbUtil.deleteOne(query);
    console.log(await DbUtil.getDisciplineById(Discipline, disciplineId));
    console.log(await DbUtil.getMany(Feedback, `SELECT * FROM feedback WHERE discipline_id=${disciplineId}`));
    console.log(await DbUtil.getMany(FeedbackTeacher, 'SELECT * FROM feedback_teacher'));
    console.log(await DbUtil.getMany(FeedbackGrade, 'SELECT * FROM feedback_grade'));
  }
}