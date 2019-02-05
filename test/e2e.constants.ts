import { ADMIN_RIGHT, JWT_SECRET, PASSWORD_HASH_SALT, USER_RIGHT } from '../src/constants';
import { UserRole } from '../src/entities/user.entity';
import { TimeUtil } from '../src/utils/time-util';

const crypto = require('crypto');
const jwt = require('jwt-simple');

export const FACULTIES = {
  INFORMATICS: {id: 1, name: 'Faculty of Informatics', shortName: 'FI'},
  FGN: {id: 2, name: 'Faculty of human science', shortName: 'FGN'},
  FEN: {id: 777, name: 'Faculty of economics', shortName: 'FEN'}
};

export const PROFESSIONS = {
  SOFTWARE_DEVELOPMENT: {id: 1, name: 'software_engineering', faculty: FACULTIES.INFORMATICS},
  GERMAN_PHILOLOGY: {id: 2, name: 'german_philology', faculty: FACULTIES.FGN},
  APPLIED_MATH: {id: 3, name: 'applied_math', faculty: FACULTIES.INFORMATICS},
  ECONOMIST: {id: 4, name: 'economics', faculty: FACULTIES.FEN}
};

export const USERS = {
  SIMPLE: {login: 'simple_user', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('simple_password').digest('base64'), email: 'simple@email.com', role: UserRole.USER, rating: 0, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT},
  SIMPLE_FGN: {login: 'not_human', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('not_human228').digest('base64'), email: 'hello@world.com', role: UserRole.USER, rating: 100, profession: PROFESSIONS.ECONOMIST},
  ADMIN_USER: {login: 'admin_user', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('admin_pass').digest('base64'), email: 'admin@gmail.com', role: UserRole.ADMIN, rating: 99},
};

export const USERS_JWT = {
  SIMPLE: jwt.encode({login: USERS.SIMPLE.login, right: USER_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
  SIMPLE_FGN: jwt.encode({login: USERS.SIMPLE_FGN.login, right: USER_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
};

export const ADMINS_JWT = {
  SIMPLE: jwt.encode({login: USERS.ADMIN_USER.login, right: ADMIN_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
};

export const INVALID_JWT = {
  INVALID_LOGIN_JWT: jwt.encode({login: 'some_invalid_login', right: ADMIN_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
  INVALID_JWT_SECRET_WORD: jwt.encode({login: USERS.ADMIN_USER.login, right: ADMIN_RIGHT, created: TimeUtil.getUnixTime()}, 'invalid_jwt'),
  INVALID_TOKEN: 'invalid_token'
}