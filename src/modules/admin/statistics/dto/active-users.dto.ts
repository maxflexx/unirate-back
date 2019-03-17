

export class ActiveUsersDto {
  login: string;
  email: string;
  professionId: number;
  feedbackNum: number;

  static fromRaw(raw: any): ActiveUsersDto {
    const dto = new ActiveUsersDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.professionId = raw.profession_id;
    dto.feedbackNum = raw.feedbackNum;
    return dto;
  }
}