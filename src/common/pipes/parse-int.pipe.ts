import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ErrorUtil } from '../../utils/error-util';

@Injectable()
export class ParseIntPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    const v = +value;
    return value;
    if (isNaN(v))
      throw ErrorUtil.getValidationError('Parameter should be number, got ' + value);
    return v;
  }
}