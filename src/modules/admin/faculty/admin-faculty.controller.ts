import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FacultyService } from '../../services/faculty.service';
import { Faculty } from '../../../entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';
import { STATUS_OK } from '../../../constants';
import { GetFacultyDto } from '../../default-user/faculty/dto/get-faculty.dto';

@Controller('admin/faculty')
export class AdminFacultyController {
  constructor(private readonly facultyService: FacultyService){}

  @Get()
  async getFaculties(@Query() params: GetFacultyDto): Promise<{total: number, faculty: Faculty[]}> {
    return await this.facultyService.getFaculties(params);
  }

  @Post()
  async createFaculty(@Body() body: CreateFacultyDto): Promise<Faculty> {
    return await this.facultyService.createFacultyAdmin(body);
  }

  @Put(':id')
  async updateFaculty(@Body() body: UpdateFacultyDto, @Param('id', new ParseIntPipe()) facultyId: number): Promise<Faculty> {
    return await this.facultyService.updateFacultyAdmin(body, facultyId);
  }

  @Delete(':id')
  async deleteFaculty(@Param('id', new ParseIntPipe()) facultyId: number): Promise<string> {
    await this.facultyService.deleteFacultyAdmin(facultyId);
    return STATUS_OK;
  }
}