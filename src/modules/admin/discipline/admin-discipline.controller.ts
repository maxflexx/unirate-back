import { Controller, Get, Query } from '@nestjs/common';
import { GetAdminDisciplineParamsDto } from './dto/get-admin-discipline-params.dto';
import { Discipline } from '../../../entities/discipline.entity';
import { DisciplineService } from '../../services/discipline.service';

@Controller('admin/discipline')
export class AdminDisciplineController {
  constructor(private readonly disciplineService: DisciplineService){}

  @Get()
  async getDisciplineAdmin(@Query() params: GetAdminDisciplineParamsDto): Promise<{disciplines: Discipline[], total: number}>  {
    return await this.disciplineService.getDisciplinesAdmin(params);
  }
}