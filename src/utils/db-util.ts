import { getManager } from 'typeorm';
import { TESTNET } from '../constants';

export class DbUtil {
  private static async executeQuery(entity, query: string, params: any) {
    const entityManager = getManager();
    return await entityManager.query(query, params);
  }

  static async getMany(entity, query: string, params: any){
    const result = await this.executeQuery(entity, query, params);
    if (result && result.length)
      return result.map(item => entity.fromRaw(item));
    else
      return null;
  }

  static async getOne(entity, query: string, params: any) {
    const result = await this.executeQuery(entity, query, params);
    if (result && result.length)
      return entity.fromRaw(TESTNET ? result[0] : result);
    else
      return null;
  }
}