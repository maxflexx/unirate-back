
export class UserResultDto {
  login: string;
  email: string;
  rating: number;
  professionName: string;

  static fromRaw(raw: any): UserResultDto {
    const dto = new UserResultDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.rating = raw.rating;
    dto.professionName = raw.name;
    return dto;
  }
}