

export class FeedbackTeacherClientDto {
  feedbackId: number;
  teacherName: string;
  teacherLastName: string;
  teacherMiddleName: string;

  static fromRaw(raw: any): FeedbackTeacherClientDto {
    const dto = new FeedbackTeacherClientDto();
    dto.feedbackId = +raw.feedbackId;
    dto.teacherName = raw.teacherName;
    dto.teacherLastName = raw.teacherLastName;
    dto.teacherMiddleName = raw.teacherMiddleName;
    return dto;
  }
}