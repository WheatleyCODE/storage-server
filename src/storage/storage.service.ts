import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IStorageService } from 'src/core';
import {
  CreateStorageOptions,
  ItemTypes,
  UpdateStorageOptions,
} from 'src/types';
import { CreateStorageDto } from './dto/CreateStorage.dto';
import { Storage, StorageDocument } from './schemas/storage.schema';

@Injectable()
export class StorageService extends IStorageService<
  StorageDocument,
  UpdateStorageOptions
> {
  constructor(
    @InjectModel(Storage.name)
    private readonly storageModel: Model<StorageDocument>,
  ) {
    super(storageModel);
  }

  async create(
    dto: CreateStorageDto,
    options?: CreateStorageOptions,
  ): Promise<StorageDocument> {
    try {
      const storage = await this.storageModel.findOne({ user: dto.user });

      if (storage) {
        throw new HttpException(
          'Хранилище уже существует',
          HttpStatus.CONFLICT,
        );
      }

      return await this.storageModel.create({ user: dto.user });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async changeDiskSpace(
    id: Types.ObjectId,
    bytes: number,
  ): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async changeUsedSpace(
    id: Types.ObjectId,
    bytes: number,
  ): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async addItem(
    id: Types.ObjectId,
    item: Types.ObjectId,
    type: ItemTypes,
  ): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async deleteItem(
    id: Types.ObjectId,
    item: Types.ObjectId,
  ): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async searchItems(
    id: Types.ObjectId,
    options: { hellO: any },
  ): Promise<StorageDocument[]> {
    throw new Error('Method not implemented.');
  }

  async getOneBy(options: UpdateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await super.getOneBy(options);

      if (!storage)
        throw new HttpException('Хранилище не найдено', HttpStatus.BAD_REQUEST);

      await storage.populate('folders');

      return storage;
    } catch (e) {
      throw e;
    }
  }
}
