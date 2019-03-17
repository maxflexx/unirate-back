
export class TeachersWithMostHonestStudentsDto {
  id: number;
  lastName: string;
  name: string;
  middleName: string;
  likes: number;

  static fromRaw(raw: any): TeachersWithMostHonestStudentsDto {
    const dto = new TeachersWithMostHonestStudentsDto();
    dto.id = +raw.id;
    dto.lastName = raw.last_name;
    dto.name = raw.name;
    dto.middleName = raw.middle_name;
    dto.likes = raw.likes;
    return dto;
  }
}