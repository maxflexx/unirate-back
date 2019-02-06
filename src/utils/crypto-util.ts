import { PASSWORD_HASH_SALT } from '../constants';

const crypto = require('crypto');
export class CryptoUtil {
  static getPasswordHash(pass: string): string {
    return crypto.createHmac('sha384', PASSWORD_HASH_SALT).update(pass).digest('base64');
  }
}