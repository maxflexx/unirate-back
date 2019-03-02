
export class UserResultDto {
  login: string;
  email: string;
  professionName: string;

  static fromRaw(raw: any): UserResultDto {
    const dto = new UserResultDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.professionName = raw.name;
    return dto;
  }
}