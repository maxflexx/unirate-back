import { getManager } from 'typeorm';

export class DbUtil {
  private static async executeQuery(entity, query: string, params: any) {
    const entityManager = getManager();
    return await entityManager.query(query, params);
  }

  static async getMany(entity, query: string, params: any){
    const result = await this.executeQuery(entity, query, params);
    if (result.length)
      return result.map(item => entity.fromRaw(item));
    else
      return null;
  }

  static async getOne(entity, query: string, params: any) {
    const result = await this.executeQuery(entity, query, params);
    if (result)
      return entity.fromRaw(result[0]);
    else
      return null;
  }
}