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
}