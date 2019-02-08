

export class FeedbackResultDto {
  feedbackId: number;
  userLogin: string;
  studentGrade: number;
  rating: number;
  comment: string;
  created: number;
  updated: number;
  disciplineId: number;
  teacherIds: number[];

  static fromRaw(raw: any): FeedbackResultDto {
    const dto = new FeedbackResultDto();
    dto.feedbackId = +raw.id;
    dto.userLogin = raw.user_login;
    dto.studentGrade = raw.student_grade;
    dto.rating = raw.rating;
    dto.comment = raw.comment;
    dto.created = raw.created;
    dto.updated = raw.updated;
    dto.disciplineId = +raw.discipline_id;
    dto.teacherIds = [+raw.teacher_id];
    return dto;
  }
}