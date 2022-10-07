import { Types } from 'mongoose';
import { AddDeleteItemDto } from 'src/storage/dto/AddDeleteItem.dto';
import { ChangeAccessTypeDto } from 'src/storage/dto/ChangeAccessType.dto';
import { ChangeIsTrashDto } from 'src/storage/dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from 'src/storage/dto/ChangeLike.dto';
import { CopyFileDto } from 'src/storage/dto/CopyFile.dto';
import { CreateAccessLinkDto } from 'src/storage/dto/CreateAccessLink.dto';
import { SearchItemDto } from 'src/storage/dto/SearchItem.dto';
import { ItemDocument } from 'src/types';
import { IDefaultService } from '../AbstractClasses/IDefaultService';

export abstract class IStorageService<T, O> extends IDefaultService<T, O> {
  abstract changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract addItem(dto: AddDeleteItemDto): Promise<T>;
  abstract deleteItem(dto: AddDeleteItemDto): Promise<T>;
  abstract searchItems(dto: SearchItemDto, size?: number): Promise<ItemDocument[]>;
  abstract changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemDocument>;
  abstract changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemDocument>;
  abstract changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemDocument>;
  abstract changeLike(dto: ChangeLikeDto): Promise<ItemDocument>;
  abstract checkParentsAndDelete(storage: Types.ObjectId): Promise<T>;
  abstract copyFile(dto: CopyFileDto): Promise<ItemDocument>;
}
