import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { GetUsersAdminDto } from './dto/get-users-admin.dto';
import { GetUsersAdminResultDto } from './dto/get-users-admin-result.dto';
import { UserDecorator } from '../../../common/decorators/user.decorator';
import { User } from '../../../entities/user.entity';
import { AccessDenied, STATUS_OK } from '../../../constants';
import { UpdateRoleAdminDto } from './dto/update-role-admin.dto';
import { UpdateUserResultDto } from './dto/update-user-result.dto';
import { UserUpdateResultDto } from '../../default-user/user/dto/user-update-result.dto';
import { UserUpdateBodyDto } from '../../default-user/user/dto/user-update-body.dto';

@Controller('admin')
export class AdminUserController {
  constructor(private readonly userService: UserService){}


  @Get('user')
  async getAdminUsers(@Query() params: GetUsersAdminDto): Promise<{total: number, users: GetUsersAdminResultDto[]}>  {
    return await this.userService.getUsersAdmin(params);
  }

  @Put('user/:login')
  async updateUserRole(@Param('login') login, @UserDecorator() user: User, @Body() body: UpdateRoleAdminDto): Promise<UpdateUserResultDto> {
    if (user.login === login)
      throw AccessDenied;
    return await this.userService.updateUserRoleAdmin(login, body);
  }

  @Put(':login')
  async updateAdmin(@Param('login') login, @UserDecorator() user: User, @Body() body: UserUpdateBodyDto): Promise<UserUpdateResultDto> {
    if (user.login !== login)
      throw AccessDenied;
    return await this.userService.updateUser(login, body);
  }

  @Delete('user/:login')
  async deleteUserAdmin(@Param('login') login): Promise<string> {
    await this.userService.deleteUserData(login);
    return STATUS_OK;
  }
}