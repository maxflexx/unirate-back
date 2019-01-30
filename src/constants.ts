/* Environment-dependent variables: begin */

import { HttpCodeException } from './common/exceptions/http-code.exception';
import { HttpStatus } from '@nestjs/common';

const ormConfig = require('../ormconfig.json');
export const ORM_CONFIG_MEMORY = ormConfig.MEMORY_DB;

export const LISTEN_PORT = 3000;

export const ORM_CONFIG = ORM_CONFIG_MEMORY;

export const JWT_SECRET = 'yu3egwfhjwhr9823q';

export const PASSWORD_HASH_SALT = 'pass_salt_hash';

export const ADMIN_RIGHT = 'admin';
export const USER_RIGHT = 'user';

export const INVALID_PARAMS = 'invalid_params';
export const ITEM_NOT_FOUND = 'item_not_found';
export const ACCESS_DENIED = 'access_denied';

export const InvalidParams = new HttpCodeException(HttpStatus.BAD_REQUEST, INVALID_PARAMS, 'Invalid parameters, check your request body or query');
export const ItemNotFound = new HttpCodeException(HttpStatus.NOT_FOUND, ITEM_NOT_FOUND, 'Item not found in database');
export const AccessDenied = new HttpCodeException(HttpStatus.FORBIDDEN, ACCESS_DENIED, 'You have not enough rights to use this method');