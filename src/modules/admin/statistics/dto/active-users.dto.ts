

export class ActiveUsersDto {
  login: string;
  email: string;
  professionName: string;
  feedbackNum: number;

  static fromRaw(raw: any): ActiveUsersDto {
    const dto = new ActiveUsersDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.professionName = raw.professionName;
    dto.feedbackNum = raw.feedbackNum;
    return dto;
  }
}