

export class GetUsersAdminResultDto {
  login: string;
  email: string;
  rating: number;
  role: number;
  professionName: string;
  totalFeedbackNumber: number;

  static fromRaw(raw: any): GetUsersAdminResultDto {
    const dto = new GetUsersAdminResultDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.rating = Math.round(raw.rating);
    dto.role = raw.role;
    dto.professionName = raw.professionName;
    dto.totalFeedbackNumber = raw.totalFeedback;
    return dto;
  }
}