

export class FeedbackResultDto {
  feedbackId: number;
  userLogin: string;
  studentGrade: number;
  rating: number;
  comment: string;
  created: number;
  disciplineName: string;
  teachers: any[];

  static fromRaw(raw: any): FeedbackResultDto {
    const dto = new FeedbackResultDto();
    dto.feedbackId = +raw.id;
    dto.userLogin = raw.user_login;
    dto.studentGrade = raw.student_grade;
    dto.rating = raw.rating;
    dto.comment = raw.comment;
    dto.created = raw.created;
    dto.disciplineName = raw.discipline_name;
    dto.teachers = [{id: +raw.teacher_id, name: raw.name, lastName: raw.last_name, middleName: raw.middle_name}];
    return dto;
  }
}