
export class DisciplineClientDto {
  id: number;
  name: string;
  year: number;
  facultyName: string;

  static fromRaw(raw: any): DisciplineClientDto {
    const dto = new DisciplineClientDto();
    dto.id = +raw.id;
    dto.name = raw.name;
    dto.year = +raw.year;
    dto.facultyName = raw.facultyName;
    return dto;
  }
}