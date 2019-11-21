import { Injectable } from '@nestjs/common';
import { Faculty } from '../../entities/faculty.entity';
import { DbUtil } from '../../utils/db-util';
import { CreateFacultyDto } from '../admin/faculty/dto/create-faculty.dto';
import { ItemAlreadyExists, ItemNotFound } from '../../constants';
import { UpdateFacultyDto } from '../admin/faculty/dto/update-faculty.dto';
import { GetFacultyDto } from '../default-user/faculty/dto/get-faculty.dto';

@Injectable()
export class FacultyService {

  async getFaculties(params: GetFacultyDto): Promise<{total: number, faculty: Faculty[]}> {
    let query = `SELECT * FROM faculty`;
    let countQuery = 'SELECT COUNT(*) AS count FROM faculty';
    if (params.facultyId != undefined || params.search) {
      query += ' WHERE ';
      countQuery += ' WHERE ';
      const queryParams = [];
      if (params.facultyId != undefined) {
        queryParams.push(`id=${params.facultyId}`);
      }
      if (params.search) {
        queryParams.push(`(name LIKE "%${params.search}%" OR short_name LIKE "%${params.search}%")`);
      }
      query += queryParams.join(' AND ');
      countQuery += queryParams.join(' AND ');
    }
    query += ' ORDER BY faculty.name ';
    query += ` LIMIT ${params.limit} OFFSET ${params.offset}`;
    return {total: await DbUtil.getCount(countQuery), faculty: await DbUtil.getMany(Faculty, query)};
  }

  async createFacultyAdmin(body: CreateFacultyDto): Promise<Faculty> {
    const faculty = await DbUtil.getOne(Faculty, `SELECT * FROM faculty WHERE short_name="${body.shortName}"`);
    if (faculty) {
      throw ItemAlreadyExists;
    }
    const id = +(await DbUtil.insertOne(`INSERT INTO faculty(name, short_name) VALUES ("${body.name}", "${body.shortName}")`));
    return await DbUtil.getFacultyById(Faculty, id);
  }

  async updateFacultyAdmin(body: UpdateFacultyDto, facultyId: number): Promise<Faculty> {
    const faculty = await DbUtil.getFacultyById(Faculty, facultyId);
    if (!faculty) {
      throw ItemNotFound;
    }

    const facultyCheck = await DbUtil.getOne(Faculty, `SELECT * FROM faculty WHERE short_name="${body.shortName}"`);
    if (facultyCheck) {
      throw ItemAlreadyExists;
    }

    faculty.updateAdmin(body);
    await DbUtil.updateOne(`UPDATE faculty SET name="${faculty.name}", short_name="${faculty.shortName}" WHERE id=${+faculty.id}`);
    return faculty;
  }

  async deleteFacultyAdmin(facultyId: number): Promise<void> {
    const faculty = await DbUtil.getFacultyById(Faculty, facultyId);
    if (!faculty) {
      throw ItemNotFound;
    }
    await DbUtil.deleteOne(`DELETE FROM faculty WHERE id=${facultyId}`);
  }
}
