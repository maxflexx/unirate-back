import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MandatoryService } from '../../services/mandatory.service';
import { CreateAdminMandatoryDto } from './dto/create-admin-mandatory.dto';
import { Mandatory } from '../../../entities/mandatory.entity';
import { DeleteAdminMandatoryDto } from './dto/delete-admin-mandatory.dto';
import { InvalidParams, STATUS_OK } from '../../../constants';
import { Discipline } from '../../../entities/discipline.entity';
import { GetMandatoryDisciplinesForProfessionDto } from '../discipline/dto/get-mandatory-disciplines-for-profession.dto';

@Controller('admin/mandatory')
export class AdminMandatoryController {
  constructor(private readonly mandatoryService: MandatoryService){}

  @Get()
  async getAdminMandatory(@Query() params: GetMandatoryDisciplinesForProfessionDto): Promise<{total: number, discipline: Discipline[]}> {
    return this.mandatoryService.getMandatoryForProfession(params.professionId);
  }

  @Post()
  async createAdminMandatory(@Body() body: CreateAdminMandatoryDto): Promise<Mandatory> {
    return this.mandatoryService.createAdminMandtatory(body);
  }

  @Delete()
  async deleteAdminMandatory(@Query() params: DeleteAdminMandatoryDto): Promise<string> {
    if (params.disciplineId == undefined && !params.professionId == undefined) {
      throw InvalidParams;
    }
    await this.mandatoryService.deleteAdminMandatory(params);
    return STATUS_OK;
  }
}