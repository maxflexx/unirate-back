
export class ProfessionStatisticsDto {
  id: number;
  name: number;
  facultyName: string;
  totalFeedback: number;

  static fromRaw(raw: any): ProfessionStatisticsDto {
    const dto = new ProfessionStatisticsDto();
    dto.id = +raw.id;
    dto.name = raw.name;
    dto.facultyName = raw.facultyName;
    dto.totalFeedback = raw.total_feedback;
    return dto;
  }
}