import {ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import { ErrorUtil } from '../../utils/error-util';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const {metatype} = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      this.validateNested(errors);
    }
    return object;
  }

  validateNested(errors) {
    if (errors.length > 0) {
      const firstError = errors[0];
      for (const key in firstError.constraints) {
        if (firstError.constraints.hasOwnProperty(key)) {
          const childValue = firstError.constraints[key];
          throw ErrorUtil.getValidationError('Validation failed: ' + childValue);
        }
      }
      if (firstError && firstError.children && firstError.children.length > 0)
        return this.validateNested(firstError.children);
      throw Error('Something went wrong');
    }
    return;
  }

  toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}