
export class DisciplineClientDto {
  id: number;
  name: string;
  year: number;
  facultyName: string;
  feedbackNum: number;

  static fromRaw(raw: any): DisciplineClientDto {
    const dto = new DisciplineClientDto();
    dto.id = +raw.id;
    dto.name = raw.name;
    dto.year = +raw.year;
    dto.facultyName = raw.facultyName;
    dto.feedbackNum = +raw.feedbackNum;
    return dto;
  }
}