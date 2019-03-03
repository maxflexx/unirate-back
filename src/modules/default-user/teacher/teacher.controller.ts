import { Controller, Get, Query } from '@nestjs/common';
import { Teacher } from '../../../entities/teacher.entity';
import { TeacherService } from '../../services/teacher.service';
import { GetTeacherAdminDto } from '../../admin/teacher/dto/get-teacher-admin.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService){}

  @Get()
  async getTeacher(@Query() params: GetTeacherAdminDto): Promise<{total: number, teachers: Teacher[]}> {
    return await this.teacherService.getTeachers(params);
  }

}