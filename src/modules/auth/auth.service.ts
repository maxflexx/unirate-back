import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { LoginBodyDto } from './dto/login-body.dto';
import { AccessDenied, ADMIN_RIGHT, ItemNotFound, JWT_SECRET, USER_RIGHT } from '../../constants';
import { ErrorUtil } from '../../utils/error-util';
import { TimeUtil } from '../../utils/time-util';
import { DbUtil } from '../../utils/db-util';
const jwt = require('jwt-simple');

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async login(body: LoginBodyDto): Promise<{token: string}> {
    const user = await DbUtil.getOne(User, `SELECT * FROM user AS u WHERE u.login=$1`, [body.login]);
    if (!user) {
      throw ItemNotFound;
    }
    if (user.password !== body.password) {
      throw ErrorUtil.getValidationError('Invalid password hash');
    }
    if (user.role === UserRole.USER && body.asAdmin) {
      throw AccessDenied;
    }
    if (user.role === UserRole.ADMIN && !body.asAdmin) {
      throw AccessDenied;
    }
    return {token: this.getJwtToken(body.login, body.asAdmin)};
  }

  getJwtToken(login: string, asAdmin: boolean): string {
    const payload = {login, right: asAdmin ? ADMIN_RIGHT : USER_RIGHT, created: TimeUtil.getUnixTime()};
    return jwt.encode(payload, JWT_SECRET);
  }

}