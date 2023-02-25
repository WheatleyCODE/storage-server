import { StorageCollectionNames, ItemTypes } from 'src/types';

export const getStorageCollectionName = (type: ItemTypes): StorageCollectionNames => {
  const name = `${type.toLocaleLowerCase()}s` as StorageCollectionNames;
  return name;
};

export const getStorageName = (userName: string): string => {
  return `Хранилище пользователя ${userName}`;
};
