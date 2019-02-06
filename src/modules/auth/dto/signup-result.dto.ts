
export class SignupResultDto {
  login: string;
  password: string;
  email: string;
  role: number;
  rating: number;
  professionId: number;

  static fromRaw(raw: any): SignupResultDto {
    const dto = new SignupResultDto();
    dto.login = raw.login;
    dto.password = raw.password;
    dto.email = raw.email;
    dto.role = raw.role;
    dto.rating = raw.rating;
    dto.professionId = raw.profession_id || undefined;
    return dto;
  }
}