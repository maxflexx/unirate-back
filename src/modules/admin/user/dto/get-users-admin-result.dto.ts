

export class GetUsersAdminResultDto {
  login: string;
  email: string;
  rating: number;
  role: number;
  professionId: number;
  totalFeedbackNumber: number;

  static fromRaw(raw: any): GetUsersAdminResultDto {
    const dto = new GetUsersAdminResultDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.rating = Math.round(raw.rating);
    dto.role = raw.role;
    dto.professionId = raw.professionId;
    dto.totalFeedbackNumber = raw.totalFeedback;
    return dto;
  }
}