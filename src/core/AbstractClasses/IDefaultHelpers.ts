import { HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';

export abstract class IDefaultHelpers<T, O> {
  constructor(protected readonly model: Model<any>) {}

  protected async findByIdAndCheck(id: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item) {
        throw new HttpException(
          `Item не найден, ${this.model.modelName}`,
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
          `Item не найден, ${this.model.modelName}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return item;
    } catch (e) {
      throw e;
    }
  }
}
