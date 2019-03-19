import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TeacherService } from '../../services/teacher.service';
import { GetTeacherAdminDto } from './dto/get-teacher-admin.dto';
import { Teacher } from '../../../entities/teacher.entity';
import { CreateTecherAdminDto } from './dto/create-techer-admin.dto';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';
import { UpdateTeacherAdminDto } from './dto/update-teacher-admin.dto';
import { STATUS_OK } from '../../../constants';

@Controller('admin/teacher')
export class AdminTeacherController {
  constructor(private readonly teacherService: TeacherService){}

  @Get()
  async getTeacherAdmin(@Query() params: GetTeacherAdminDto): Promise<{total: number, teacher: Teacher[]}> {
    return await this.teacherService.getTeachers(params);
  }

  @Post()
  async createTeacherAdmin(@Body() body: CreateTecherAdminDto): Promise<Teacher> {
    return await this.teacherService.createTeacherAdmin(body);
  }

  @Put(':teacherId')
  async updateTeacherAdmin(@Param('teacherId', new ParseIntPipe()) teacherId: number, @Body() body: UpdateTeacherAdminDto): Promise<Teacher> {
    return await this.teacherService.updateTeacherAdmin(teacherId, body);
  }

  @Delete(':teacherId')
  async deleteTeacherAdmin(@Param('teacherId', new ParseIntPipe()) teacherId: number): Promise<string> {
    await this.teacherService.deleteTeacherAdmin(teacherId);
    return STATUS_OK;
  }
}