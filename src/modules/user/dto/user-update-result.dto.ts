

export class UserUpdateResultDto {
  login: string;
  email: string;
  professionId: number;

  static fromRaw(raw: any): UserUpdateResultDto {
    const dto = new UserUpdateResultDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.professionId = raw.profession_id;
    return dto;
  }
}