import { UserService } from '../../services/user.service';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { ErrorUtil } from '../../../utils/error-util';
import { UserUpdateBodyDto } from './dto/user-update-body.dto';
import { UserUpdateResultDto } from './dto/user-update-result.dto';
import { AccessDenied, STATUS_OK } from '../../../constants';
import { UserDecorator } from '../../../common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}


  @Get(':login')
  async getUserByLogin(@Param('login') login: string, @UserDecorator() user: User): Promise<User> {
    if (!login) {
      throw ErrorUtil.getValidationError('No login field');
    }
    if (login != user.login) {
      throw AccessDenied;
    }
    return await this.userService.getUser(login);
  }

  @Put(':login')
  async updateUserData(@Param('login') login: string, @Body() body: UserUpdateBodyDto, @UserDecorator() user: User): Promise<UserUpdateResultDto> {
    if (!login)
      throw ErrorUtil.getValidationError('No login');
    if (login != user.login) {
      throw AccessDenied;
    }
    return await this.userService.updateUser(login, body);
  }

  @Delete(':login')
  async deleteUserData(@Param('login') login: string, @UserDecorator() user: User): Promise<string> {
    if (!login) {
      throw ErrorUtil.getValidationError('No login field');
    }
    if (login != user.login) {
      throw AccessDenied;
    }
    await this.userService.deleteUserData(login);
    return STATUS_OK;
  }
}