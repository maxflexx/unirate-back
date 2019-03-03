import { getManager } from 'typeorm';

export class DbUtil {

  static async getMany(entity, query: string): Promise<any[]> {
    const entityManager = getManager();
    const result = await entityManager.query(query);
    if (result && result.length)
      return result.map(item => entity.fromRaw(item));
    else
      return null;
  }

  static async getOne(entity, query: string) {
    const entityManager = getManager();
    const result = await entityManager.query(query);
    if (result && result.length)
      return entity.fromRaw(result[0]);
    else
      return null;
  }

  static async getCount(query) {
    const entityManager = getManager();
    const result = await entityManager.query(query);
    return +result[0].count;
  }

  static async insertOne(query: string) {
    const entityManager = getManager();
    const result = await entityManager.query(query);
    return result;
  }

  static async deleteOne(query: string) {
    const entityManager = getManager();
    await entityManager.query(query);
  }

  static async updateOne(query: string) {
    const entityManager = getManager();
    await entityManager.query(query);
  }

  static async getUserByLogin(entity, login: string) {
    return await DbUtil.getOne(entity, `SELECT * FROM user AS u WHERE u.login="${login}"`);
  }

  static async getDisciplineById(entity, id: number) {
    return await DbUtil.getOne(entity, `SELECT * FROM discipline WHERE id=${id}`);
  }

  static async getFeedbackById(entity, id: number) {
    return await DbUtil.getOne(entity, `SELECT * FROM feedback WHERE id=${id}`);
  }

  static async getFeedbackByDisciplineId(entity, disciplineId: number) {
    return await DbUtil.getMany(entity, `SELECT * FROM feedback WHERE discipline_id=${disciplineId}`);
  }

  static async getFeedbackGrade(entity, feedbackId: number, userLogin: string) {
    return await DbUtil.getOne(entity, `SELECT * FROM feedback_grade WHERE feedback_id=${feedbackId} AND user_login="${userLogin}"`);
  }

  static async getFeedbackGradeByFeedbackid(entity, id: number) {
    return await DbUtil.getMany(entity, `SELECT * FROM feedback_grade WHERE feedback_id=${id}`);
  }

  static async getFacultyById(entity, id: number) {
    return await DbUtil.getOne(entity, `SELECT * FROM faculty WHERE id=${id}`);
  }

  static async getProfessionById(entity, id: number) {
    return await DbUtil.getOne(entity, `SELECT * FROM profession WHERE id=${id}`);
  }

  static async getMandatoryByProfessionId(entity, professionId: number) {
    return await DbUtil.getMany(entity, `SELECT * FROM mandatory WHERE profession_id=${professionId}`);
  }

  static async getMandatoryByDisciplineId(entity, disciplineId: number) {
    return await DbUtil.getMany(entity,`SELECT * FROM mandatory WHERE discipline_id=${disciplineId}`);
  }

  static async getMandatoryByDisciplineAndProfession(entity, professionId: number, disciplineId: number) {
    return await DbUtil.getOne(entity,`SELECT * FROM mandatory WHERE discipline_id=${disciplineId} AND profession_id=${professionId}`);
  }
}