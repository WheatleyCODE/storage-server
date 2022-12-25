import { HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IDatabase } from 'src/types';

export abstract class MongoDatabase<T, O> extends IDatabase<T, O> {
  constructor(private readonly model: Model<any>) {
    super();
  }

  protected async findByIdAndCheck(id: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item) {
        throw new HttpException(
          `Элемент не найден, ${this.model.modelName}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return item;
    } catch (e) {
      throw e;
    }
  }

  protected async findOneByAndCheck(options: {
    [key in keyof O]: any;
  }): Promise<T> {
    try {
      const item = await this.model.findOne({ ...options });

      if (!item) {
        throw new HttpException(
          `Элемент не найден, ${this.model.modelName}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return item;
    } catch (e) {
      throw e;
    }
  }

  async update(id: Types.ObjectId, options: { [key in keyof O]: any }): Promise<T> {
    try {
      return await this.model.findByIdAndUpdate(id, options);
    } catch (e) {
      throw new HttpException(
        `Ошибка при обновлении, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected async getAll(count = 10, offset = 0): Promise<T[]> {
    try {
      return await this.model.find().skip(offset).limit(count);
    } catch (e) {
      throw new HttpException(
        `Ошибка при получении всех, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected async findAllBy(options: { [key in keyof O]: any }): Promise<T[]> {
    try {
      return await this.model.find({ ...options });
    } catch (e) {
      throw new HttpException(
        `Ошибка при поиске всех, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected async findAllByIds(ids: Types.ObjectId[]): Promise<T[]> {
    try {
      return await this.model.find({ _id: { $in: ids } });
    } catch (e) {
      throw new HttpException(
        `Ошибка при поиске всех по ids, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
