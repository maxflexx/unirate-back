import { HttpCodeException } from '../common/exceptions/http-code.exception';
import { HttpStatus } from '@nestjs/common';
import { INVALID_PARAMS, ITEM_NOT_FOUND } from '../constants';

export class ErrorUtil {
  static getValidationError(message: string) {
    return new HttpCodeException(HttpStatus.BAD_REQUEST, INVALID_PARAMS, message);
  }

  static getNotFoundError(message: string) {
    return new HttpCodeException(HttpStatus.NOT_FOUND, ITEM_NOT_FOUND, message);
  }
}