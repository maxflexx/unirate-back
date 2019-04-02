import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from '../../services/statistics.service';
import { Profession } from '../../../entities/profession.entity';
import { Teacher } from '../../../entities/teacher.entity';
import { User } from '../../../entities/user.entity';
import { ActiveUsersDto } from './dto/active-users.dto';
import { TeachersWithMostHonestStudentsDto } from './dto/teachers-with-most-honest-students.dto';
import { UserRatingDto } from './dto/user-rating.dto';
import { PagingDto } from '../../../common/dto/paging.dto';

@Controller('admin/statistics')
export class AdminStatisticsController {
  constructor(private readonly statisticsService: StatisticsService){}

  @Get('profession')
  async getStatisticsProfession(@Query() params: PagingDto): Promise<{ total: number, profession: Profession[] }> {
    return await this.statisticsService.getStatisticsProfession(params);
  }

  @Get('popular-teacher')
  async getPopularTeachers(@Query() params: PagingDto): Promise<{total: number, teacher: Teacher[]}> {
    return await this.statisticsService.getPopularTeachers(params);
  }

  @Get('most-active-user')
  async getActiveUsers(@Query() params: PagingDto): Promise<{total: number, user: ActiveUsersDto[]}> {
    return await this.statisticsService.getMostActiveUsers(params);
  }

  @Get('teacher-most-honest-student')
  async getTeachersWithMostHonestStudents(@Query() params: PagingDto): Promise<{total: number, teacher: TeachersWithMostHonestStudentsDto[]}>  {
    return await this.statisticsService.getTeachersWithMostHonestStudents(params);
  }

  @Get('user-rating')
  async getUserRatings(@Query() params: PagingDto): Promise<{total: number, user: UserRatingDto[]}> {
    return await this.statisticsService.getUsersRating(params);
  }
}