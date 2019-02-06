import { UserService } from './user.service';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { ErrorUtil } from '../../utils/error-util';
import { UserUpdateBodyDto } from './dto/user-update-body.dto';
import { UserUpdateResultDto } from './dto/user-update-result.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}


  @Get(':login')
  async getUserByLogin(@Param('login') login: string): Promise<User> {
    if (!login) {
      throw ErrorUtil.getValidationError('No login field');
    }
    return await this.userService.getUser(login);
  }

  @Put(':login')
  async updateUserData(@Param('login') login: string, @Body() body: UserUpdateBodyDto): Promise<UserUpdateResultDto> {
    return await this.userService.updateUser(login, body);
  }
}