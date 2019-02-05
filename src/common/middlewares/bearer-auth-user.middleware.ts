import { Injectable, MiddlewareFunction } from '@nestjs/common';
import { JWT_SECRET, JWT_TOKEN_LIFETIME, Unauthorized, USER_RIGHT } from '../../constants';
import { TimeUtil } from '../../utils/time-util';
import { DbUtil } from '../../utils/db-util';
import { User, UserRole } from '../../entities/user.entity';
const jwt = require('jwt-simple');
@Injectable()
export class BearerAuthUserMiddleware {
  constructor(){}


  resolve(): MiddlewareFunction {
    return async (req, res, next) => {
      let jwtToken;
      try {
        jwtToken = BearerAuthUserMiddleware.decodeJwt(req.headers.authorization);
      }catch (e) {
        throw Unauthorized;
      }
      const user = await DbUtil.getOne(User, 'SELECT * FROM User AS u WHERE u.login = $1', [jwtToken.login]);
      if (!user)
        throw Unauthorized;
      if (user.role !== UserRole.USER)
        throw Unauthorized;
      req.user = user;
      req.jwt = req.headers.authorization.split(' ');
      next();
    };
  }

  static decodeJwt(token: string): boolean | object {
    const jwtToken = token.split(' ');
    if (jwtToken[0] !== 'Bearer' || !jwtToken[1])
      return false;
    const decodedJwt = jwt.decode(jwtToken[1], JWT_SECRET);
    if (decodedJwt && decodedJwt.login && decodedJwt.right === USER_RIGHT && decodedJwt.created <= TimeUtil.getUnixTime() + JWT_TOKEN_LIFETIME) {
      return true;
    }
    return false;
  }
}