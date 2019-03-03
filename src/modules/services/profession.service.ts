import { Injectable } from '@nestjs/common';
import { GetProfessionDto } from '../admin/profession/dto/get-profession.dto';
import { Profession } from '../../entities/profession.entity';
import { DbUtil } from '../../utils/db-util';
import { CreateProfessionDto } from '../admin/profession/dto/create-profession.dto';
import { Faculty } from '../../entities/faculty.entity';
import { ItemAlreadyExists, ItemNotFound } from '../../constants';
import { UpdateProfessionDto } from '../admin/profession/dto/update-profession.dto';

@Injectable()
export class ProfessionService {
  constructor(){}

  async getProfessions(params: GetProfessionDto): Promise<{total: number, professions: Profession[]}> {
    let query = 'SELECT * FROM profession';
    let countQuery = 'SELECT COUNT(*) AS count FROM profession';
    if (params.facultyId != undefined || params.professionId != undefined || params.search) {
      query += ' WHERE ';
      countQuery += ' WHERE ';
      const queryParams = [];
      if (params.facultyId != undefined) {
        queryParams.push(`faculty_id=${params.facultyId}`);
      }
      if (params.professionId != undefined) {
        queryParams.push(`id=${params.professionId}`);
      }
      if (params.search) {
        queryParams.push(`name LIKE "%${params.search}%"`);
      }
      query += queryParams.join(' AND ');
      countQuery += queryParams.join(' AND ');
    }
    return {total: await DbUtil.getCount(countQuery), professions: await DbUtil.getMany(Profession, query)};
  }

  async createProfessionAdmin(body: CreateProfessionDto): Promise<Profession> {
    const faculty = await DbUtil.getFacultyById(Faculty, body.facultyId);
    if (!faculty) {
      throw ItemNotFound;
    }
    const professionWithSameName = await DbUtil.getOne(Profession, `SELECT * FROM profession WHERE name="${body.name}"`);
    if (professionWithSameName) {
      throw ItemAlreadyExists;
    }
    const id = +(await DbUtil.insertOne(`INSERT INTO profession(name, faculty_id) VALUES ("${body.name}", ${body.facultyId})`));
    return await DbUtil.getProfessionById(Profession, id);
  }

  async updateProfessionAdmin(body: UpdateProfessionDto, professionId: number): Promise<Profession> {
    const profession = await DbUtil.getProfessionById(Profession, professionId);
    if (!profession) {
      throw ItemNotFound;
    }
    if (body.name) {
      const professionWithSameName = await DbUtil.getOne(Profession, `SELECT * FROM profession WHERE name="${body.name}"`);
      if (professionWithSameName) {
        throw ItemAlreadyExists;
      }
    }
    if (body.facultyId) {
      const faculty = await DbUtil.getFacultyById(Faculty, body.facultyId);
      if (!faculty) {
        throw ItemNotFound;
      }
    }
    profession.updateAdmin(body);
    await DbUtil.updateOne(`UPDATE profession SET name="${profession.name}", faculty_id=${profession.facultyId} WHERE id=${professionId}`);
    return profession;
  }

  async deleteProfessionAdmin(professionId: number): Promise<void> {
    const profession = await DbUtil.getProfessionById(Profession, professionId);
    if (!profession)
      throw ItemNotFound;
    await DbUtil.deleteOne(`DELETE FROM profession WHERE id=${professionId}`);
  }
}