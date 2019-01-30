import { PASSWORD_HASH_SALT } from '../src/constants';
import { UserRole } from '../src/modules/entities/user.entity';

const crypto = require('crypto');

export const FACULTIES = {
  INFORMATICS: {id: 1, name: 'Faculty of Informatics', shortName: 'FI'},
};

export const PROFESSIONS = {
  SOFTWARE_DEVELOPMENT: {id: 1, name: 'software_engineering', faculty: FACULTIES.INFORMATICS},
};

export const USERS = {
  SIMPLE: {login: 'simple_user', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('simple_password').digest('base64'), email: 'simple@email.com', role: UserRole.USER, rating: 0, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT}
};
