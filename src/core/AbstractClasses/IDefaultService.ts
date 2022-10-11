import { HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ItemsData } from 'src/types';
import { IDefaultHelpers } from './IDefaultHelpers';

export abstract class IDefaultService<T, O> extends IDefaultHelpers<T, O> {
  constructor(model: Model<any>) {
    super(model);
  }

  abstract create(options: { [key in keyof O]: any }): Promise<T>;
  abstract delete(id: Types.ObjectId): Promise<T & ItemsData>;

  async update(id: Types.ObjectId, options: { [key in keyof O]: any }): Promise<T> {
    try {
      return await this.model.findByIdAndUpdate(id, options);
    } catch (e) {
      throw new HttpException(
        `Ошибка при update, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rename(id: Types.ObjectId, name: string): Promise<T> {
    try {
      const object = await this.model.findById(id);
      object.name = name;
      await object.save();
      return object;
    } catch (e) {
      throw new HttpException(
        `Ошибка при rename, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(count = 10, offset = 0): Promise<T[]> {
    try {
      return await this.model.find().skip(offset).limit(count);
    } catch (e) {
      throw new HttpException(
        `Ошибка при getAll, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneById(id: Types.ObjectId): Promise<T> {
    try {
      return await this.model.findById(id);
    } catch (e) {
      throw new HttpException(
        `Ошибка при getOneById, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllByIds(ids: Types.ObjectId[]): Promise<T[]> {
    try {
      return await this.model.find({ _id: { $in: ids } });
    } catch (e) {
      throw new HttpException(
        `Ошибка при getAllByIds, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneBy(options: { [key in keyof O]: any }): Promise<T> {
    try {
      return await this.model.findOne({ ...options });
    } catch (e) {
      throw new HttpException(
        `Ошибка при getOneBy, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBy(options: { [key in keyof O]: any }): Promise<T[]> {
    try {
      return await this.model.find({ ...options });
    } catch (e) {
      throw new HttpException(
        `Ошибка при getAllBy, ${this.model.modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
