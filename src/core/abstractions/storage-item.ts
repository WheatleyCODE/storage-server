import { Model, Types } from 'mongoose';
import * as uuid from 'uuid';
import { DefaultService } from './default-service';
import { AccessTypes, ItemsData, IStorageItem, DateFilds, IDownloadData } from 'src/types';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class StorageItem<T, O> extends DefaultService<T, O> implements IStorageItem<T> {
  constructor(model: Model<any>) {
    super(model);
  }

  abstract deleteByIds(ids: Types.ObjectId[]): Promise<T[]>;
  abstract getFilePath(id: Types.ObjectId): Promise<IDownloadData[]>;
  abstract copy(id: Types.ObjectId): Promise<T & ItemsData>;
  abstract delete(id: Types.ObjectId): Promise<T & ItemsData>;

  async changeAccessType(id: Types.ObjectId, type: AccessTypes): Promise<T> {
    try {
      const item: any = await this.changeDate(id, ['changeDate']);
      item.accessType = type;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.changeDate(id, ['changeDate']);

      const link = uuid.v4();
      const type = item.type.toLowerCase();
      item.accessLink = `${process.env.URL_API}/share/${type}/${link}`;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeDate(id: Types.ObjectId, filds: DateFilds[]): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      filds.forEach((fild) => (item[fild] = Date.now()));
      await item.save();
      return item;
    } catch (e) {
      throw new HttpException('Ошибка при изменении даты', HttpStatus.INTERNAL_SERVER_ERROR);
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

  async changeIsTrash(id: Types.ObjectId, isTrash: boolean): Promise<T> {
    try {
      const item: any = await this.changeDate(id, ['changeDate']);

      item.isTrash = isTrash;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeName(id: Types.ObjectId, name: string): Promise<T> {
    try {
      const item: any = await this.changeDate(id, ['changeDate']);

      item.name = name;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeParent(id: Types.ObjectId, parent: Types.ObjectId | null): Promise<T> {
    try {
      const item: any = await this.changeDate(id, ['changeDate']);
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

  async changeStar(id: Types.ObjectId, isStar: boolean): Promise<T> {
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
}
