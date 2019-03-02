import { ADMIN_RIGHT, JWT_SECRET, PASSWORD_HASH_SALT, USER_RIGHT } from '../src/constants';
import { UserRole } from '../src/entities/user.entity';
import { TimeUtil } from '../src/utils/time-util';
import { CryptoUtil } from '../src/utils/crypto-util';

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
  GRADE_FEEDBACKS1: {login: 'grade_feedbacks1', password: CryptoUtil.getPasswordHash('grade_feed11'), email: 'grade11@feedback.com', role: UserRole.USER},
  GRADE_FEEDBACKS: {login: 'grade_feedbacks', password: CryptoUtil.getPasswordHash('grade_feed'), email: 'grade@feedback.com', role: UserRole.USER},
  SIMPLE: {login: 'simple_user', password: CryptoUtil.getPasswordHash('simple_password'), email: 'simple@email.com', role: UserRole.USER, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT},
  SIMPLE_FGN: {login: 'not_human', password: CryptoUtil.getPasswordHash('not_human228'), email: 'hello@world.com', role: UserRole.USER, profession: PROFESSIONS.ECONOMIST},
  ADMIN_USER: {login: 'admin_user', password: CryptoUtil.getPasswordHash('admin_pass'), email: 'admin@gmail.com', role: UserRole.ADMIN},
};


export const DISCIPLINE = {
  OOP: {id: 1, name: 'OOP', year: 2, faculty: FACULTIES.INFORMATICS},
  PROCEDURE: {id: 2, name: 'Procedure programming', year: 2, faculty: FACULTIES.INFORMATICS}
  OBDZ: {id: 3, name: 'OBDZ', year: 3, faculty: FACULTIES.INFORMATICS},
  ALGORITHMS: {id: 4, name: 'Algorithms', year: 2, faculty: FACULTIES.INFORMATICS},
  ENGLISH: {id: 5, name: 'English', year: 1, faculty: FACULTIES.FGN},
  ENGLISH_LIT: {id: 6, name: 'English lit', year: 3, faculty: FACULTIES.FGN},
  ECONOMICS: {id: 7, name: 'Economics', year: 2, faculty: FACULTIES.FEN},
  HISTORY: {id: 8, name: 'History', year: 1, faculty: FACULTIES.FEN},
};

export const TEACHER = {
  GULAEVA: {id: 1, name: 'Nataliya', lastName: 'Gulaeva', middleName: 'Mykhailivna'},
  BOUBLIK: {id: 2, name: 'Volodymyr', lastName: 'Boublik', middleName: 'Vasylyovych'},
  GORBORUKOV: {id: 3, name: 'Ivan', lastName: 'Gorobrukov', middleName: 'GGG'},
  USHENKO: {id: 4, name: 'Andrew', lastName: 'Ushenko', middleName: 'Ushch'},
  TOP_ECONOMIST: {id: 5, name: 'Top economist', lastName: 'The best economist', middleName: 'Godlike economist'}
};

export const FEEDBACKS = {
  OOP1: {id: 1, studentGrade: 71, rating: 5, comment: 'The best OOP', created: TimeUtil.getUnixTime(), user: USERS.SIMPLE, discipline: DISCIPLINE.OOP},
  OOP2: {id: 2, rating: 10, comment: 'Good oop', created: TimeUtil.getUnixTime() - 100, updated: TimeUtil.getUnixTime() - 50, user: USERS.SIMPLE_FGN, discipline: DISCIPLINE.OOP},
  OOP3: {id: 3, rating: -5, studentGrade: 99, comment: 'BAD OOP', created: TimeUtil.getUnixTime() + 1, user: USERS.SIMPLE_FGN, discipline: DISCIPLINE.OOP},
  OBDZ1: {id: 4, rating: 100, studentGrade: 100, comment: 'IZI', created: TimeUtil.getUnixTime() - 61, updated: TimeUtil.getUnixTime() - 50, user: USERS.SIMPLE, discipline: DISCIPLINE.OBDZ},
  OBDZ2: {id: 5, rating: 50, comment: 'LOL OBDZ', created: TimeUtil.getUnixTime(), user: USERS.SIMPLE_FGN, discipline: DISCIPLINE.OBDZ},
  PROCEDURE1: {id: 6, rating: 20, comment: 'Procedure ok', created: TimeUtil.getUnixTime(), user: USERS.SIMPLE, discipline: DISCIPLINE.PROCEDURE}
};

export const FEEDBACK_TEACHER = {
  BOUBLIK_OOP1: {feedback: FEEDBACKS.OOP1, teacher: TEACHER.BOUBLIK},
  GORBORUKOV_OOP1: {feedback: FEEDBACKS.OOP1, teacher: TEACHER.GORBORUKOV},
  BOUBLIK_OOP2: {feedback: FEEDBACKS.OOP2, teacher: TEACHER.BOUBLIK},
  BOUBLIK_OOP3: {feedback: FEEDBACKS.OOP3, teacher: TEACHER.BOUBLIK},
  BOUBLIK_PROCEDURE1: {feedback: FEEDBACKS.PROCEDURE1, teacher: TEACHER.BOUBLIK},
  GULAEVA_OBDZ1: {feedback: FEEDBACKS.OBDZ1, teacher: TEACHER.GULAEVA},
  GULAEVA_OBDZ2: {feedback: FEEDBACKS.OBDZ2, teacher: TEACHER.GULAEVA},
  USHENKO_OBDZ2: {feedback: FEEDBACKS.OBDZ2, teacher: TEACHER.USHENKO},
};

export const FEEDBACK_GRADE = {
  OOP1: {id: 1, like: 1, feedback: FEEDBACKS.OOP1, user: USERS.GRADE_FEEDBACKS},
  OOP1_1: {id: 2, like: 1, feedback: FEEDBACKS.OOP1, user: USERS.GRADE_FEEDBACKS1},
  OOP3: {id: 3, like: 1, feedback: FEEDBACKS.OOP3, user: USERS.GRADE_FEEDBACKS1},
  OOP3_1: {id: 4, like: -1, feedback: FEEDBACKS.OOP3, user: USERS.SIMPLE},
  OBDZ: {id: 5, like: 1, feedback: FEEDBACKS.OBDZ1, user: USERS.GRADE_FEEDBACKS}
};


export const MANDATORY = {
  SE_OBDS: {discipline: DISCIPLINE.OBDZ, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT},
  SE_OOP: {discipline: DISCIPLINE.OOP, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT},
  ECONOMICS: {discipline: DISCIPLINE.ECONOMICS, profession: PROFESSIONS.ECONOMIST},
  ENGLISH_ECONOMICS: {discipline: DISCIPLINE.ENGLISH, profession: PROFESSIONS.ECONOMIST},
  SE_ENGLISH: {discipline: DISCIPLINE.ENGLISH, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT}
};

export const USERS_JWT = {
  SIMPLE: jwt.encode({login: USERS.SIMPLE.login, right: USER_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
  SIMPLE_FGN: jwt.encode({login: USERS.SIMPLE_FGN.login, right: USER_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
  GRADE_FEEDBACKS: jwt.encode({login: USERS.GRADE_FEEDBACKS.login, right: USER_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
  GRADE_FEEDBACKS1: jwt.encode({login: USERS.GRADE_FEEDBACKS1.login, right: USER_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET)
};

export const ADMINS_JWT = {
  SIMPLE: jwt.encode({login: USERS.ADMIN_USER.login, right: ADMIN_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
};

export const INVALID_JWT = {
  INVALID_LOGIN_JWT: jwt.encode({login: 'some_invalid_login', right: ADMIN_RIGHT, created: TimeUtil.getUnixTime()}, JWT_SECRET),
  INVALID_JWT_SECRET_WORD: jwt.encode({login: USERS.ADMIN_USER.login, right: ADMIN_RIGHT, created: TimeUtil.getUnixTime()}, 'invalid_jwt'),
  INVALID_TOKEN: 'invalid_token'
};