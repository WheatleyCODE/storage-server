import { Types } from 'mongoose';
import { MongoDatabase } from './mongo-database';
import { IDefaultService } from 'src/types';

// ! Все для обычных сервисов
export abstract class DefaultService<T, O>
  extends MongoDatabase<T, O>
  implements IDefaultService<T, O>
{
  async getOneById(id: Types.ObjectId) {
    return await this.findByIdAndCheck(id);
  }

  async getOneBy(options: { [key in keyof O]: any }) {
    return await this.findOneByAndCheck(options);
  }
}
