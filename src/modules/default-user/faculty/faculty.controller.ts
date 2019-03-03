import { Controller, Get, Query } from '@nestjs/common';
import { FacultyService } from '../../services/faculty.service';
import { Faculty } from '../../../entities/faculty.entity';
import { GetFacultyDto } from './dto/get-faculty.dto';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService){}

  @Get()
  async getFaculties(@Query() params: GetFacultyDto): Promise<{total: number, faculties: Faculty[]}> {
    return await this.facultyService.getFaculties(params);
  }
}