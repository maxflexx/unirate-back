import { User } from '../../entities/user.entity';
import { DbUtil } from '../../utils/db-util';
import { ItemNotFound } from '../../constants';
import { UserResultDto } from './dto/user-result.dto';
import { UserUpdateResultDto } from './dto/user-update-result.dto';
import { UserUpdateBodyDto } from './dto/user-update-body.dto';

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

  async updateUser(login: string, body: UserUpdateBodyDto): Promise<UserUpdateResultDto> {
    if (body.professionId == undefined && !body.password && !body.email) {
      const user = await DbUtil.getUserByLogin(UserUpdateResultDto, login);
      if (!user)
        throw ItemNotFound;
      return user;
    }
    const user = await DbUtil.getUserByLogin(User, login);
    if (!user)
      throw ItemNotFound;
    let query = 'UPDATE user SET ';
    if (body.email)
      query += `email="${body.email}", `;
    if (body.password)
      query += `password="${body.password}", `;
    if (body.professionId != undefined)
      query += `profession_id=${body.professionId}, `;
    query = query.substr(0, query.length - 2) + ` WHERE login="${login}";`;
    await DbUtil.updateOne(query);
    return DbUtil.getUserByLogin(UserUpdateResultDto, login);
  }

  async deleteUserData(login: string): Promise<void> {
    const user = await DbUtil.getUserByLogin(User, login);
    if (!user)
      throw ItemNotFound;
    await DbUtil.deleteOne(`DELETE FROM user WHERE login="${login}"`);
  }
}