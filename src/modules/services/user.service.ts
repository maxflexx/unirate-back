import { User } from '../../entities/user.entity';
import { DbUtil } from '../../utils/db-util';
import { ItemNotFound } from '../../constants';
import { UserResultDto } from '../default-user/user/dto/user-result.dto';
import { UserUpdateResultDto } from '../default-user/user/dto/user-update-result.dto';
import { UserUpdateBodyDto } from '../default-user/user/dto/user-update-body.dto';
import { GetUsersAdminDto } from '../admin/user/dto/get-users-admin.dto';
import { GetUsersAdminResultDto } from '../admin/user/dto/get-users-admin-result.dto';
import { UpdateRoleAdminDto } from '../admin/user/dto/update-role-admin.dto';
import { UpdateUserResultDto } from '../admin/user/dto/update-user-result.dto';

export class UserService {
  constructor(){}

  async getUser(login: string): Promise<User> {
    const user = await DbUtil.getOne(UserResultDto, `SELECT u.email, u.login, p.name FROM user u
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
    await DbUtil.updateOne(`UPDATE feedback_grade SET user_login = "deleted_user" WHERE user_login ="${login}"`);
    await DbUtil.updateOne(`UPDATE feedback SET user_login = "deleted_user" WHERE user_login ="${login}"`);
  }

  async getUsersAdmin(params: GetUsersAdminDto): Promise<{total: number, users: GetUsersAdminResultDto[]}> {
    let query = `SELECT u.login AS login, u.email AS email, u.role AS role, u.profession_id AS professionId, COALESCE(AVG(f.rating),0) AS rating, COUNT(f.id) as totalFeedback
    FROM user AS u
    LEFT JOIN feedback f ON f.user_login=u.login`;
    let countQuery = 'SELECT COUNT(*) AS count FROM user';
    if (params.userLogin) {
      countQuery += ` WHERE login="${params.userLogin}"`;
      query += ` WHERE u.login="${params.userLogin}"`;
    }
    query += ` GROUP BY u.login`;
    if (params.orderBy === 'login')
      query += ` ORDER BY u.${params.orderBy}`;
    else
      query += ` ORDER BY ${params.orderBy}`;
    query += ` LIMIT ${params.limit} OFFSET ${params.offset}`;
    const total = await DbUtil.getCount(countQuery);
    return await {total, users: await DbUtil.getMany(GetUsersAdminResultDto, query)};
  }

  async updateUserRoleAdmin(login: string, body: UpdateRoleAdminDto): Promise<UpdateUserResultDto> {
    const user = await DbUtil.getUserByLogin(User, login);
    if (!user)
      throw ItemNotFound;
    user.updateRole(body);
    await DbUtil.updateOne(`UPDATE user SET role=${user.role} WHERE login="${login}"`);
    return UpdateUserResultDto.fromUser(user);
  }

}