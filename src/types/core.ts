import { AlbumService } from 'src/album/album.service';
import { AlbumDocument } from 'src/album/schemas/album.schema';
import { FileService } from 'src/file/file.service';
import { FileDocument } from 'src/file/schemas/file.schema';
import { FolderService } from 'src/folder/folder.service';
import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { TrackService } from 'src/track/track.service';

export enum AccessTypes {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  LINK = 'LINK',
}

export enum ItemTypes {
  FOLDER = 'FOLDER',
  TRACK = 'TRACK',
  FILE = 'FILE',
  ALBUM = 'ALBUM',
}

export enum ItemFileTypes {
  TRACK = 'TRACK',
  FILE = 'FILE',
  ALBUM = 'ALBUM',
}

export enum FolderColors {
  GREY = 'GREY',
  RED = 'RED',
  BLUE = 'BLUE',
}

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export type ObjectServices = {
  [ItemTypes.FOLDER]: FolderService;
  [ItemTypes.TRACK]: TrackService;
  [ItemTypes.FILE]: FileService;
  [ItemTypes.ALBUM]: AlbumService;
};

export type ObjectFileServices = {
  [ItemTypes.TRACK]: TrackService;
  [ItemTypes.FILE]: FileService;
  [ItemTypes.ALBUM]: AlbumService;
};

export type StorageCollectionNames = 'folders' | 'tracks' | 'files' | 'albums';

export const StorageItemTypes: ItemTypes[] = [
  ItemTypes.FOLDER,
  ItemTypes.TRACK,
  ItemTypes.FILE,
  ItemTypes.ALBUM,
];

export type ItemsData = {
  count: number;
  items: ItemDocument[];
  size: number;
};

export type ItemDocument = FolderDocument | TrackDocument | FileDocument | AlbumDocument;

export type Modify<T, R> = Omit<T, keyof R> & R;
