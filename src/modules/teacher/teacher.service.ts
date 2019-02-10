import { Injectable } from '@nestjs/common';
import { GetTeacherParamsDto } from './dto/get-teacher-params.dto';
import { Teacher } from '../../entities/teacher.entity';
import { DbUtil } from '../../utils/db-util';

@Injectable()
export class TeacherService {
  constructor(){}

  async getTeachers(params: GetTeacherParamsDto): Promise<Teacher[]> {
    if (params.teacherId != undefined) {
      return await DbUtil.getMany(Teacher, `SELECT * FROM teacher WHERE id=${params.teacherId}`);
    }
    return await DbUtil.getMany(Teacher, 'SELECT * FROM teacher');
  }
}