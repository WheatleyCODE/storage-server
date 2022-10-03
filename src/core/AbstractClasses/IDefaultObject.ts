import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import * as uuid from 'uuid';
import { AccessTypes } from 'src/types';
import { IDefaultService } from './IDefaultService';

export abstract class IDefaultObject<T, O> extends IDefaultService<T, O> {
  async changeAccessType(id: Types.ObjectId, type: AccessTypes): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.accessType = type;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(id: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      const link = uuid.v4();
      const type = item.accessType.toLoverCase();
      item.accessLink = `${process.env.URL_CLIENT}/share/${type}}/${link}`;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeOpenDate(id: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.openDate = Date.now();
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeIsTrash(id: Types.ObjectId, isTrash: boolean): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.isTrash = isTrash;
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async addLike(id: Types.ObjectId, user: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.likeCount++;
      item.likedUsers.push(user);
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async subLike(id: Types.ObjectId, user: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.likeCount--;
      item.likedUsers = item.likedUsers.filter(
        (likedUser) => likedUser !== user,
      );
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async addListen(id: Types.ObjectId, user: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.listenCount++;
      const index = item.listenedUsers.findIndex(
        (listenedUser) => listenedUser === user,
      );

      if (index === -1) item.listenedUsers.push(user);

      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async addStar(id: Types.ObjectId, user: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.starredCount++;
      item.starredUsers.push(user);
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async subStar(id: Types.ObjectId, user: Types.ObjectId): Promise<T> {
    try {
      const item = await this.model.findById(id);

      if (!item)
        throw new HttpException('Item не найден', HttpStatus.BAD_REQUEST);

      item.starredCount--;
      item.starredUsers = item.starredUsers.filter(
        (likedUser) => likedUser !== user,
      );
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async addComment(
    id: Types.ObjectId,
    user: Types.ObjectId,
    text: string,
  ): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
