import { Types } from 'mongoose';
import * as uuid from 'uuid';
import { AccessTypes } from 'src/types';
import { IDefaultService } from './IDefaultService';

export abstract class IDefaultObject<T, O> extends IDefaultService<T, O> {
  readonly ITEM_WIEGTH = 8;

  abstract deleteByIds(ids: Types.ObjectId[]): Promise<T[]>;

  async changeAccessType(id: Types.ObjectId, type: AccessTypes): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.accessType = type;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      const link = uuid.v4();
      const type = item.type.toLowerCase();
      item.accessLink = `${process.env.URL_CLIENT}/share/${type}/${link}`;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeOpenDate(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.openDate = Date.now();
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeIsTrash(id: Types.ObjectId, isTrash: boolean): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.isTrash = isTrash;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeLike(id: Types.ObjectId, user: Types.ObjectId, isLike: boolean): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      if (isLike) {
        item.likeCount++;
        item.likedUsers.push(user);
        return await item.save();
      }

      item.likeCount--;
      item.likedUsers = item.likedUsers.filter(
        (likedUser) => likedUser.toString() !== user.toString(),
      );
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  // ! Локально расширить user?: Types.ObjectId
  async addListen(id: Types.ObjectId, user?: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      item.listenCount++;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  // ! Локально расширить user?: Types.ObjectId
  async changeStar(id: Types.ObjectId, isStar: boolean, user?: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      if (isStar) {
        item.starredCount++;
      } else {
        item.starredCount--;
      }
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  // Todo добавить после прототипирования комментраиев
  async addComment(id: Types.ObjectId, user: Types.ObjectId, text: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
