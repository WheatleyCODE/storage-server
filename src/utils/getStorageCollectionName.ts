import { ItemFileTypes, StorageCollectionNames, ItemTypes } from 'src/types';

export const getStorageCollectionName = (
  type: ItemTypes | ItemFileTypes,
): StorageCollectionNames => {
  const name = `${type.toLocaleLowerCase()}s` as StorageCollectionNames;
  return name;
};
