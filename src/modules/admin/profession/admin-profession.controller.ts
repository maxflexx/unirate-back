import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProfessionService } from '../../services/profession.service';
import { GetProfessionDto } from './dto/get-profession.dto';
import { Profession } from '../../../entities/profession.entity';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';
import { STATUS_OK } from '../../../constants';

@Controller('admin/profession')
export class AdminProfessionController {
  constructor(private readonly professionService: ProfessionService){}

  @Get()
  async getProfession(@Query() params: GetProfessionDto): Promise<{total: number, professions: Profession[]}> {
    return await this.professionService.getProfessionsAdmin(params);
  }

  @Post()
  async createProfessionAdmin(@Body() body: CreateProfessionDto): Profession<Profession> {
    return await this.professionService.createProfessionAdmin(body);
  }

  @Put(':professionId')
  async updateProfessionAdmin(@Body() body: UpdateProfessionDto, @Param('professionId', new ParseIntPipe()) professionId: number): Promise<Profession> {
    return await this.professionService.updateProfessionAdmin(body, professionId);
  }

  @Delete(':professionId')
  async deleteProfessionAdmin(@Param('professionId', new ParseIntPipe()) professionId: number): Promise<string> {
    await this.professionService.deleteProfessionAdmin(professionId);
    return STATUS_OK;
  }
}