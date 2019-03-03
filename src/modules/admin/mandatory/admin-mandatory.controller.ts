import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { MandatoryService } from '../../services/mandatory.service';
import { CreateAdminMandatoryDto } from './dto/create-admin-mandatory.dto';
import { Mandatory } from '../../../entities/mandatory.entity';
import { DeleteAdminMandatoryDto } from './dto/delete-admin-mandatory.dto';
import { InvalidParams, STATUS_OK } from '../../../constants';

@Controller('admin/mandatory')
export class AdminMandatoryController {
  constructor(private readonly mandatoryService: MandatoryService){}

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