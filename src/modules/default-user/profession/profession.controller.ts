import { Controller, Get, Query } from '@nestjs/common';
import { ProfessionService } from '../../services/profession.service';
import { GetProfessionDto } from '../../admin/profession/dto/get-profession.dto';
import { Profession } from '../../../entities/profession.entity';

@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService){}

  @Get()
  async getProfession(@Query() params: GetProfessionDto): Promise<{total: number, profession: Profession[]}> {
    return await this.professionService.getProfessions(params);
  }
}