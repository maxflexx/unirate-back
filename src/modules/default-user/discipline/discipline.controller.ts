import { Controller, Get, Query } from '@nestjs/common';
import { DisciplineService } from '../../services/discipline.service';
import { GetAdminDisciplineParamsDto } from '../../admin/discipline/dto/get-admin-discipline-params.dto';
import { Discipline } from '../../../entities/discipline.entity';

@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService){}

  @Get()
  async getDisciplineAdmin(@Query() params: GetAdminDisciplineParamsDto): Promise<{discipline: Discipline[], total: number}>  {
    return await this.disciplineService.getDisciplinesAdmin(params);
  }
}