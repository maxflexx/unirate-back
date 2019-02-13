import { Injectable } from '@nestjs/common';
import { GetAdminDisciplineParamsDto } from '../admin/discipline/dto/get-admin-discipline-params.dto';
import { Discipline } from '../../entities/discipline.entity';
import { DbUtil } from '../../utils/db-util';

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
}