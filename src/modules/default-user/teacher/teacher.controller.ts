import { Controller, Get, Query } from '@nestjs/common';
import { GetTeacherParamsDto } from './dto/get-teacher-params.dto';
import { Teacher } from '../../../entities/teacher.entity';
import { TeacherService } from '../../services/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService){}

  @Get('')
  async getTeachers(@Query() params: GetTeacherParamsDto): Promise<Teacher[]> {
    return await this.teacherService.getTeachers(params);
  }

}