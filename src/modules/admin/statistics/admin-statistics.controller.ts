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
  async getStatisticsProfession(): Promise<{ total: number, profession: Profession[] }> {
    return await this.statisticsService.getStatisticsProfession();
  }

  @Get('popular-teacher')
  async getPopularTeachers(): Promise<{total: number, teacher: Teacher[]}> {
    return await this.statisticsService.getPopularTeachers();
  }

  @Get('most-active-user')
  async getActiveUsers(): Promise<{total: number, user: ActiveUsersDto[]}> {
    return await this.statisticsService.getMostActiveUsers();
  }

  @Get('teacher-most-honest-student')
  async getTeachersWithMostHonestStudents(): Promise<{total: number, teacher: TeachersWithMostHonestStudentsDto[]}>  {
    return await this.statisticsService.getTeachersWithMostHonestStudents();
  }

  @Get('user-rating')
  async getUserRatings(): Promise<{total: number, user: UserRatingDto[]}> {
    return await this.statisticsService.getUsersRating();
  }
}