import { getManager } from 'typeorm';

export class DbUtil {

  static async getMany(entity, query: string){
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
}