import { Injectable } from '@nestjs/common';
import { CreateAdminMandatoryDto } from '../admin/mandatory/dto/create-admin-mandatory.dto';
import { Mandatory } from '../../entities/mandatory.entity';
import { DbUtil } from '../../utils/db-util';
import { ItemAlreadyExists } from '../../constants';
import { Discipline } from '../../entities/discipline.entity';
import { ErrorUtil } from '../../utils/error-util';
import { Profession } from '../../entities/profession.entity';
import { DeleteAdminMandatoryDto } from '../admin/mandatory/dto/delete-admin-mandatory.dto';

@Injectable()
export class MandatoryService {
  constructor(){}

  async createAdminMandtatory(body: CreateAdminMandatoryDto): Promise<Mandatory> {
    const checkExistence = await DbUtil.getMandatoryByDisciplineAndProfession(Mandatory, body.professionId, body.disciplineId);
    if (checkExistence){
      throw ItemAlreadyExists;
    }
    const discipline = await DbUtil.getDisciplineById(Discipline, body.disciplineId);
    if (!discipline) {
      throw ErrorUtil.getNotFoundError('No such discipline ' + body.disciplineId);
    }

    const profession = await DbUtil.getProfessionById(Profession, body.professionId);
    if (!profession) {
      throw ErrorUtil.getNotFoundError('No such profession ' + body.professionId);
    }
    await DbUtil.insertOne(`INSERT INTO mandatory (profession_id, discipline_id) VALUES (${body.professionId}, ${body.disciplineId})`);
    return await DbUtil.getMandatoryByDisciplineAndProfession(Mandatory, body.professionId, body.disciplineId);
  }

  async deleteAdminMandatory(params: DeleteAdminMandatoryDto): Promise<void> {
    let query = 'DELETE FROM mandatory WHERE ';
    const w = [];
    if (params.disciplineId != undefined) {
      w.push(`discipline_id=${params.disciplineId}`);
    }
    if (params.professionId != undefined) {
      w.push(`profession_id=${params.professionId}`);
    }
    query += w.join(` AND `);
    await DbUtil.deleteOne(query);
  }
}