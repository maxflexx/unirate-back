import { Injectable } from '@nestjs/common';
import { GetTeacherParamsDto } from '../default-user/teacher/dto/get-teacher-params.dto';
import { Teacher } from '../../entities/teacher.entity';
import { DbUtil } from '../../utils/db-util';
import { GetTeacherAdminDto } from '../admin/teacher/dto/get-teacher-admin.dto';
import { GetTeacherAdminResultDto } from '../admin/teacher/dto/get-teacher-admin-result.dto';
import { CreateTecherAdminDto } from '../admin/teacher/dto/create-techer-admin.dto';
import { UpdateTeacherAdminDto } from '../admin/teacher/dto/update-teacher-admin.dto';
import { ItemNotFound } from '../../constants';

@Injectable()
export class TeacherService {
  constructor(){}

  async getTeachers(params: GetTeacherAdminDto): Promise<{total: number, teachers: Teacher[]}> {
    let query = `SELECT t.id AS id, t.last_name AS lastName, t.name AS name, t.middle_name AS middleName, COUNT(ft.teacher_id) AS feedbackNumber FROM teacher t LEFT JOIN feedback_teacher ft ON t.id=ft.teacher_id`;
    let countQuery = `SELECT COUNT(*) AS count FROM teacher `;
    if (params.search || params.teacherId != undefined) {
      query += ' WHERE ';
      countQuery += ' WHERE ';
      const queryParams = [];
      if (params.search) {
        queryParams.push(`(last_name LIKE "%${params.search}%" OR name LIKE "%${params.search}%" OR middle_name LIKE "%${params.search}%")`);
      }
      if (params.teacherId != undefined) {
        queryParams.push(`id=${params.teacherId}`);
      }
      query += queryParams.join(' AND ');
      countQuery += queryParams.join(' AND ');
    }
    query += ' GROUP BY t.id ';
    query += ' ORDER BY t.last_name ';
    query += ` LIMIT ${params.limit} OFFSET ${params.offset} `;
    return {total: await DbUtil.getCount(countQuery), teachers: await DbUtil.getMany(GetTeacherAdminResultDto, query)};
  }

  async createTeacherAdmin(body: CreateTecherAdminDto): Promise<Teacher> {
    const query = `INSERT INTO teacher (last_name, name, middle_name) VALUES("${body.lastName}", "${body.name}", "${body.middleName}");`;
    const id = +(await DbUtil.insertOne(query));
    return await DbUtil.getTeacherById(Teacher, id);
  }

  async updateTeacherAdmin(teacherId: number, body: UpdateTeacherAdminDto): Promise<Teacher> {
    const teacher = await DbUtil.getTeacherById(Teacher, teacherId);
    if(!teacher) {
      throw ItemNotFound;
    }
    teacher.updateAdmin(body);
    await DbUtil.updateOne(`UPDATE teacher SET middle_name="${teacher.middleName}", name="${teacher.name}", last_name="${teacher.lastName}" WHERE id=${teacherId}`);
    return teacher;
  }

  async deleteTeacherAdmin(teacherId: number): Promise<void> {
    const teacher = await DbUtil.getTeacherById(Teacher, teacherId);
    if(!teacher) {
      throw ItemNotFound;
    }
    await DbUtil.deleteOne(`DELETE FROM teacher WHERE id=${teacherId}`);
  }
}