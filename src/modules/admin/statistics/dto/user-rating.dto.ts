
export class UserRatingDto {
  login: string;
  email: string;
  role: number;
  professionName: string;
  rating: number;
  totalFeedbackNumber: number;

  static fromRaw(raw: any): UserRatingDto {
    const dto = new UserRatingDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.role = raw.role;
    dto.professionName = raw.professionName;
    dto.rating = raw.rating;
    dto.totalFeedbackNumber = raw.totalFeedbackNumber;
    return dto;
  }
}