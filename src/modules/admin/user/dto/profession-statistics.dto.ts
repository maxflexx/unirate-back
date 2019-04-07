
export class ProfessionStatisticsDto {
  id: number;
  name: number;
  facultyId: number;
  totalFeedback: number;

  static fromRaw(raw: any): ProfessionStatisticsDto {
    const dto = new ProfessionStatisticsDto();
    dto.id = +raw.id;
    dto.name = raw.name;
    dto.facultyId = raw.faculty_id;
    dto.totalFeedback = raw.total_feedback;
    return dto;
  }
}