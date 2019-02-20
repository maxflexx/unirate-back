import { Injectable } from '@nestjs/common';
import { Faculty } from '../../entities/faculty.entity';
import { DbUtil } from '../../utils/db-util';
import { CreateFacultyDto } from '../admin/faculty/dto/create-faculty.dto';
import { ItemAlreadyExists, ItemNotFound } from '../../constants';
import { UpdateFacultyDto } from '../admin/faculty/dto/update-faculty.dto';

@Injectable()
export class FacultyService {

  async getFacultiesAdmin(): Promise<Faculty[]> {
    return await DbUtil.getMany(Faculty, 'SELECT * FROM faculty');
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