import { UserService } from './user.service';
import { Controller, Get, Param } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { ErrorUtil } from '../../utils/error-util';

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
}