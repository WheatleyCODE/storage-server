import { Types } from 'mongoose';
import { Pagination } from 'src/types';

export abstract class DefaultService<T, O> {
  abstract create(dto: any, options?: { [key in keyof O]: any }): Promise<T>;
  abstract delete(id: Types.ObjectId): Promise<T>;
  abstract rename(id: Types.ObjectId, name: string): Promise<T>;
  abstract getAll(pag?: Pagination): Promise<T[]>;
  abstract update(
    id: Types.ObjectId,
    dto: any,
    options?: { [key in keyof O]: any },
  ): Promise<T>;
  abstract getOneById(id: Types.ObjectId): Promise<T>;
  abstract getAllByIds(ids: Types.ObjectId[]): Promise<T[]>;
  abstract getOneBy(options: { [key in keyof O]: any }): Promise<T>;
  abstract getAllBy(options: { [key in keyof O]: any }): Promise<T[]>;
}
