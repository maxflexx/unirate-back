import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from '../../services/statistics.service';
import { Profession } from '../../../entities/profession.entity';
import { Teacher } from '../../../entities/teacher.entity';
import { User } from '../../../entities/user.entity';
import { ActiveUsersDto } from './dto/active-users.dto';
import { TeachersWithMostHonestStudentsDto } from './dto/teachers-with-most-honest-students.dto';
import { UserRatingDto } from './dto/user-rating.dto';

@Controller('admin/statistics')
export class AdminStatisticsController {
  constructor(private readonly statisticsService: StatisticsService){}

  @Get('profession')
  async getStatisticsProfession(): Promise<{ total: number, professions: Profession[] }> {
    return await this.statisticsService.getStatisticsProfession();
  }

  @Get('popular-teachers')
  async getPopularTeachers(): Promise<{total: number, teachers: Teacher[]}> {
    return await this.statisticsService.getPopularTeachers();
  }

  @Get('most-active-users')
  async getActiveUsers(): Promise<{total: number, users: ActiveUsersDto[]}> {
    return await this.statisticsService.getMostActiveUsers();
  }

  @Get('teacher-most-honest-students')
  async getTeachersWithMostHonestStudents(): Promise<{total: number, teachers: TeachersWithMostHonestStudentsDto[]}>  {
    return await this.statisticsService.getTeachersWithMostHonestStudents();
  }

  @Get('user-rating')
  async getUserRatings(): Promise<{total: number, users: UserRatingDto[]}> {
    return await this.statisticsService.getUsersRating();
  }
}