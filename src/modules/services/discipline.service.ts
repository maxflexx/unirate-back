import { Injectable } from '@nestjs/common';
import { GetAdminDisciplineParamsDto } from '../admin/discipline/dto/get-admin-discipline-params.dto';
import { Discipline } from '../../entities/discipline.entity';
import { DbUtil } from '../../utils/db-util';
import { CreateDisciplineDto } from '../admin/discipline/dto/create-discipline.dto';
import { Faculty } from '../../entities/faculty.entity';
import { ItemNotFound } from '../../constants';
import { UpdateDisciplineDto } from '../admin/discipline/dto/update-discipline.dto';

@Injectable()
export class DisciplineService {
  constructor(){}

  async getDisciplinesAdmin(params: GetAdminDisciplineParamsDto): Promise<{disciplines: Discipline[], total: number}> {
    let query = `SELECT * FROM discipline `;
    let countQuery = `SELECT COUNT(*) AS count FROM discipline `;
    if (params.mandatoryProfessionId != undefined) {
      query += `LEFT JOIN mandatory ON mandatory.discipline_id = discipline.id `;
      countQuery += `LEFT JOIN mandatory ON mandatory.discipline_id = discipline.id `;
    }
    if (params.facultyId != undefined || params.id != undefined || params.year != undefined || params.mandatoryProfessionId != undefined || params.search) {
      query += 'WHERE ';
      countQuery += 'WHERE ';
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
      if (params.search != undefined) {
        queryParams.push(`name LIKE "%${params.search}%"`);
      }
      query += queryParams.join(' AND ');
      countQuery += queryParams.join(' AND ');
    }
    query += ` LIMIT ${params.limit} OFFSET ${params.offset}`;
    const disciplines = await DbUtil.getMany(Discipline, query);
    return {disciplines, total: await DbUtil.getCount(countQuery)};
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