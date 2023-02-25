import { isValidObjectId, Model, Types } from 'mongoose';
import * as uuid from 'uuid';
import { ReadStream } from 'fs';
import { DefaultService } from './default-service';
import { AccessTypes, ItemsData, IStorageItem, DateFilds } from 'src/types';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class StorageItem<T, O> extends DefaultService<T, O> implements IStorageItem<T> {
  constructor(model: Model<any>) {
    super(model);
  }

  abstract deleteByIds(ids: Types.ObjectId[]): Promise<T[]>;
  abstract download(id: Types.ObjectId): Promise<{ file: ReadStream; filename: string }>;
  abstract copy(id: Types.ObjectId): Promise<T & ItemsData>;
  abstract getFilePath(id: Types.ObjectId): Promise<{ path: string; filename: string }>;
  abstract delete(id: Types.ObjectId): Promise<T & ItemsData>;

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
      item.accessLink = `${process.env.URL_API}/share/${type}/${link}`;
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

  async changeName(id: Types.ObjectId, name: string): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.name = name;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeParent(id: Types.ObjectId, parent: Types.ObjectId | null): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      item.parent = parent === null ? undefined : parent;
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async getChildrens(parent: Types.ObjectId): Promise<T[]> {
    try {
      return await this.findAllBy({ parent } as any);
    } catch (e) {
      throw e;
    }
  }

  async changeLike(id: Types.ObjectId, user: Types.ObjectId, isLike: boolean): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      if (item.likedUsers.includes(user) && isLike) {
        return item;
      }

      if (isLike) {
        item.likeCount++;
        item.likedUsers.push(user);
        return await item.save();
      }

      if (!isLike && item.likeCount > 0) {
        item.likeCount--;
        item.likedUsers = item.likedUsers.filter(
          (likedUser) => likedUser.toString() !== user.toString(),
        );
      }
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async addListen(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      item.listenCount++;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  // ! Локально расширить user?: Types.ObjectId
  // ! Придумать как реализовать звезды
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

  async searchPublic(text: string, count = 10, offset = 0): Promise<T[]> {
    try {
      const tracks = await this.model
        .find({ name: { $regex: new RegExp(text, 'i') }, accessType: AccessTypes.PUBLIC })
        .skip(offset)
        .limit(count);
      return tracks;
    } catch (e) {
      throw new HttpException('Ошибка при поиске', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPublic(count = 10, offset = 0): Promise<T[]> {
    try {
      const tracks = await this.model
        .find({ accessType: AccessTypes.PUBLIC })
        .skip(offset)
        .limit(count);

      return tracks;
    } catch (e) {
      throw new HttpException('Ошибка при поиске всех публичных', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ! fix
  async changeDate(item: any, filds: DateFilds[]): Promise<T> {
    try {
      if (typeof item === 'object' && !isValidObjectId(item)) {
        filds.forEach((fild) => (item[fild] = Date.now()));
        return await item.save();
      }
    } catch (e) {
      throw new HttpException('Ошибка при поиске треков', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
