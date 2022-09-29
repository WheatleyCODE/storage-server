import { Types } from 'mongoose';
import { AccessType } from 'src/types';
import { DefaultService } from './DefaultService';

export abstract class DefaultObject<T, O> extends DefaultService<T, O> {
  abstract changeAccessType(id: Types.ObjectId, type: AccessType): Promise<T>;
  abstract changeAccessLink(id: Types.ObjectId): Promise<T>;
  abstract changeOpenDate(id: Types.ObjectId): Promise<T>;
  abstract changeIsTrash(id: Types.ObjectId): Promise<T>;
  abstract addLike(id: Types.ObjectId, user: Types.ObjectId): Promise<T>;
  abstract addListen(id: Types.ObjectId, user: Types.ObjectId): Promise<T>;
  abstract addStar(id: Types.ObjectId, user: Types.ObjectId): Promise<T>;
  abstract addComment(
    id: Types.ObjectId,
    user: Types.ObjectId,
    text: string,
  ): Promise<T>;
}
