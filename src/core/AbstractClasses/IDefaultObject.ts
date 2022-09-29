import { Types } from 'mongoose';
import { AccessTypes } from 'src/types';
import { IDefaultService } from './IDefaultService';

export abstract class IDefaultObject<T, O> extends IDefaultService<T, O> {
  abstract changeAccessType(id: Types.ObjectId, type: AccessTypes): Promise<T>;
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
