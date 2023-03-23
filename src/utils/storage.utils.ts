/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import { StorageCollectionNames, ItemTypes, ItemDocument, DateFilds } from 'src/types';

export const getStorageCollectionName = (type: ItemTypes): StorageCollectionNames => {
  const name = `${type.toLocaleLowerCase()}s` as StorageCollectionNames;
  return name;
};

export const getStorageName = (userName: string): string => {
  return `Хранилище пользователя ${userName}`;
};

export const changeDate = async (item: ItemDocument, filds: DateFilds[]): Promise<ItemDocument> => {
  try {
    filds.forEach((fild) => (item[fild] = Date.now()));
    return await item.save();
  } catch (e) {
    throw new HttpException('Ошибка при изменении даты', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const addListen = async (item: ItemDocument): Promise<ItemDocument> => {
  try {
    item.listenCount += 1;
    return await item.save();
  } catch (e) {
    throw new HttpException('Ошибка при добавлении listen', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

type ObjectKeys = string | number | symbol;

export const delFildsByObj = <T, R extends ObjectKeys = string>(obj: T, delKeys: Array<keyof T>): Omit<T, R> => {
  delKeys.forEach((key) => {
    delete obj[key];
  });

  return obj;
};



