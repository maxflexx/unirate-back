
export class GetTeacherAdminResultDto {
  id: number;
  lastName: string;
  name: string;
  middleName: string;
  feedbackNumber: number;

  static fromRaw(raw: any): GetTeacherAdminResultDto {
    const dto = new GetTeacherAdminResultDto();
    dto.id = +raw.id;
    dto.lastName = raw.lastName;
    dto.name = raw.name;
    dto.middleName = raw.middleName;
    dto.feedbackNumber = raw.feedbackNumber;
    return dto;
  }
}