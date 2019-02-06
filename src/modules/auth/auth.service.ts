import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { LoginBodyDto } from './dto/login-body.dto';
import { AccessDenied, ADMIN_RIGHT, ItemAlreadyExists, ItemNotFound, JWT_SECRET, USER_RIGHT } from '../../constants';
import { ErrorUtil } from '../../utils/error-util';
import { TimeUtil } from '../../utils/time-util';
import { DbUtil } from '../../utils/db-util';
import { SignupBodyDto } from './dto/signup-body.dto';
import { SignupResultDto } from './dto/signup-result.dto';
const jwt = require('jwt-simple');

@Injectable()
export class AuthService {
  constructor() {}

  async login(body: LoginBodyDto): Promise<{token: string, isAdmin: boolean}> {
    const user = await DbUtil.getUserByLogin(User, body.login);
    if (!user) {
      throw ItemNotFound;
    }
    if (user.password !== body.password) {
      throw ErrorUtil.getValidationError('Invalid password hash');
    }
    return {token: this.getJwtToken(user.login, user.role), isAdmin: user.role === 1};
  }


  async signup(body: SignupBodyDto): Promise<SignupResultDto> {
    const user = await DbUtil.getUserByLogin(User, body.login);
    if (user)
      throw ItemAlreadyExists;
    if (body.professionId != undefined)
       await DbUtil.insertOne(`INSERT INTO user (login, password, email, role, rating, profession_id) VALUES ("${body.login}", "${body.password}", "${body.email}", ${UserRole.USER}, ${0}, ${body.professionId});`);
    else
      await DbUtil.insertOne(`INSERT INTO user (login, password, email, role, rating) VALUES ("${body.login}", "${body.password}", "${body.email}", ${UserRole.USER}, ${0});`);
    return await DbUtil.getUserByLogin(SignupResultDto, body.login);
  }

  getJwtToken(login: string, asAdmin: boolean): string {
    const payload = {login, right: asAdmin ? ADMIN_RIGHT : USER_RIGHT, created: TimeUtil.getUnixTime()};
    return jwt.encode(payload, JWT_SECRET);
  }

}