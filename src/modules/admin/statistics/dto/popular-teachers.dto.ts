

export class PopularTeachersDto {
  id: number;
  lastName: string;
  name: string;
  middleName: string;
  feedbackNum: number;

  static fromRaw(raw: any): PopularTeachersDto {
    const dto = new PopularTeachersDto();
    dto.id = +raw.id;
    dto.lastName = raw.last_name;
    dto.name = raw.name;
    dto.middleName = raw.middle_name;
    dto.feedbackNum = raw.feedbackNum;
    return dto;
  }
}