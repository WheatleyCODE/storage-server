import { Types } from 'mongoose';
import { MongoDatabase } from './mongo-database';
import { IDefaultService } from 'src/types';

export abstract class DefaultService<T, O>
  extends MongoDatabase<T, O>
  implements IDefaultService<T, O>
{
  async getOneBy(options: { [key in keyof O]: O[key] }): Promise<T> {
    return this.model.findOne(options);
  }

  async getOneById(options: { [key in keyof O]: O[key] }): Promise<T> {
    return this.model.findById(options);
  }

  async getOneByIdAndCheck(id: Types.ObjectId): Promise<T> {
    return await this.findByIdAndCheck(id);
  }

  async getOneByAndCheck(options: { [key in keyof O]: O[key] }): Promise<T> {
    return await this.findOneByAndCheck(options);
  }

  async getAllBy(options: { [key in keyof O]: O[key] }): Promise<T[]> {
    return await this.findAllBy(options);
  }

  async getAllByIds(ids: Types.ObjectId[]): Promise<T[]> {
    return await this.findAllByIds(ids);
  }
}
