import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GetAdminDisciplineParamsDto } from './dto/get-admin-discipline-params.dto';
import { Discipline } from '../../../entities/discipline.entity';
import { DisciplineService } from '../../services/discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { STATUS_OK } from '../../../constants';

@Controller('admin/discipline')
export class AdminDisciplineController {
  constructor(private readonly disciplineService: DisciplineService){}

  @Get()
  async getDisciplineAdmin(@Query() params: GetAdminDisciplineParamsDto): Promise<{disciplines: Discipline[], total: number}>  {
    return await this.disciplineService.getDisciplinesAdmin(params);
  }

  @Post()
  async createDisciplineAdmin(@Body() body: CreateDisciplineDto): Promise<Discipline> {
    return await this.disciplineService.createDisciplineAdmin(body);
  }

  @Put(':disciplineId')
  async updateDisciplineAdmin(@Param('disciplineId', new ParseIntPipe()) disciplineId: number, @Body() body: UpdateDisciplineDto): Promise<Discipline> {
    return await this.disciplineService.updateDisciplineAdmin(disciplineId, body);
  }

  @Delete(':disciplineId')
  async deleteDisciplineAdmin(@Param('disciplineId', new ParseIntPipe()) disciplineId: number): Promise<string> {
    await this.disciplineService.deleteDisciplineAdmin(disciplineId);
    return STATUS_OK;
  }
}