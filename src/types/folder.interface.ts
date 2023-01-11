import { Types } from 'mongoose';
import { CreateFolderDto } from 'src/folder/dto/create-folder.dto';
import { FolderTransferData } from 'src/transfer';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';

export enum FolderColors {
  GREY = 'GREY',
  RED = 'RED',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
}
export interface IFolderService<T> {
  getParents(id: Types.ObjectId): Promise<T[]>;
  changeColor(id: Types.ObjectId, color: FolderColors): Promise<T>;
  createFolder(dto: CreateFolderDto, user: Types.ObjectId): Promise<FolderTransferData>;
}

export interface ICreateFolderOptions {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  color?: FolderColors;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
}

export interface IUpdateFolderOptions extends DeepPartial<ICreateFolderOptions> {}
