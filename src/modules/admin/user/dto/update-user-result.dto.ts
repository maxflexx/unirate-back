import { User } from '../../../../entities/user.entity';

export class UpdateUserResultDto {
  login: string;
  email: string;
  role: number;
  professionId: number;

  static fromUser(user: User): UpdateUserResultDto {
    const dto = new UpdateUserResultDto();
    dto.login = user.login;
    dto.email = user.email;
    dto.role = user.role;
    dto.professionId = user.professionId;
    return dto;
  }
}