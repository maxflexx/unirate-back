
export class UserRatingDto {
  login: string;
  email: string;
  role: number;
  professionId: number;
  rating: number;
  totalFeedbackNumber: number;

  static fromRaw(raw: any): UserRatingDto {
    const dto = new UserRatingDto();
    dto.login = raw.login;
    dto.email = raw.email;
    dto.role = raw.role;
    dto.professionId = raw.profession_id;
    dto.rating = raw.rating;
    dto.totalFeedbackNumber = raw.totalFeedbackNumber;
    return dto;
  }
}