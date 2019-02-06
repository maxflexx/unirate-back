import { User } from '../../entities/user.entity';
import { DbUtil } from '../../utils/db-util';
import { ItemNotFound } from '../../constants';

export class UserService {
  constructor(){}

  async getUser(login: string): Promise<User> {
    const user = DbUtil.getOne(User, 'SELECT * FROM User u WHERE u.login=$1', [login]);
    if (!user)
      throw ItemNotFound;
    return user;
  }
}