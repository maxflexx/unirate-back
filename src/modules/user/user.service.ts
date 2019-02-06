import { User } from '../../entities/user.entity';
import { DbUtil } from '../../utils/db-util';
import { ItemNotFound } from '../../constants';
import { UserResultDto } from './dto/user-result.dto';

export class UserService {
  constructor(){}

  async getUser(login: string): Promise<User> {
    const user = await DbUtil.getOne(UserResultDto, `SELECT u.email, u.login, u.rating, p.name FROM user u
                                                  INNER JOIN profession p ON p.id = u.profession_id
                                                  WHERE u.login="${login}"`);
    if (!user)
      throw ItemNotFound;
    return user;
  }
}