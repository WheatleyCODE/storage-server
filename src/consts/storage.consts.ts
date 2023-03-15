import { ItemTypes } from 'src/types';

export const collectionTypes = {
  folders: ItemTypes.FOLDER,
  tracks: ItemTypes.TRACK,
  files: ItemTypes.FILE,
  albums: ItemTypes.ALBUM,
  images: ItemTypes.IMAGE,
  videos: ItemTypes.VIDEO,
};

export const storageCollectionNames: Array<keyof typeof collectionTypes> = [
  'folders',
  'tracks',
  'files',
  'albums',
  'images',
  'videos',
];
