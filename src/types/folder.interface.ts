import { Types } from 'mongoose';
import { AccessTypes, FolderColors, ItemTypes } from './core.interface';

export interface IFolderService<T> {
  getParents(id: Types.ObjectId): Promise<T[]>;
  changeColor(id: Types.ObjectId, color: FolderColors): Promise<T>;
}

export type CreateFolderOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  color?: FolderColors;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
};

export type UpdateFolderOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  color?: FolderColors;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
};
