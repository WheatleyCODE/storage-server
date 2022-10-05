import { StorageCollectionNames } from './../types/core';
import { ItemTypes } from 'src/types';

export const getStorageCollectionName = (type: ItemTypes): StorageCollectionNames => {
  const name = `${type.toLocaleLowerCase()}s` as StorageCollectionNames;
  return name;
};
