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
import { Profession } from '../../entities/profession.entity';

@Injectable()
export class DisciplineService {
  constructor(){}

  async getDisciplinesAdmin(params: GetAdminDisciplineParamsDto): Promise<{disciplines: Discipline[], total: number}> {
    let query = `SELECT * FROM discipline `;
    if (params.mandatoryProfessionId != undefined) {
      query += `LEFT JOIN mandatory ON mandatory.discipline_id = discipline.id `;
    }
    if (params.facultyId != undefined || params.id != undefined || params.year != undefined || params.mandatoryProfessionId != undefined) {
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
      if (params.mandatoryProfessionId != undefined) {
        queryParams.push(`mandatory.profession_id=${params.mandatoryProfessionId}`);
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
    const id = +(await DbUtil.insertOne(`INSERT INTO discipline(name, year, faculty_id) VALUES
    ("${body.name}", ${body.year}, ${body.facultyId})`));
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
    await DbUtil.insertOne(`UPDATE discipline SET name="${discipline.name}", year=${discipline.year}, faculty_id=${discipline.facultyId} WHERE id=${disciplineId}`);
    return await DbUtil.getDisciplineById(Discipline, disciplineId);
  }

  async deleteDisciplineAdmin(disciplineId: number): Promise<void> {
    const discipline = await DbUtil.getDisciplineById(Discipline, disciplineId);
    if (!discipline)
      throw ItemNotFound;
    await DbUtil.deleteOne(`DELETE FROM discipline WHERE discipline.id=${disciplineId}`);
  }
}