import { Types } from 'mongoose';
import { AddItemDto } from 'src/storage/dto/AddItem.dto';
import { DeleteItemDto } from 'src/storage/dto/DeleteItem.dto';
import { AddListenDto } from 'src/storage/dto/AddListen.dto';
import { ChangeAccessTypeDto } from 'src/storage/dto/ChangeAccessType.dto';
import { ChangeIsTrashDto } from 'src/storage/dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from 'src/storage/dto/ChangeLike.dto';
import { ChangeOpenDateDto } from 'src/storage/dto/ChangeOpenDate.dto';
import { CopyFileDto } from 'src/storage/dto/CopyFile.dto';
import { CreateAccessLinkDto } from 'src/storage/dto/CreateAccessLink.dto';
import { SearchItemDto } from 'src/storage/dto/SearchItem.dto';
import { StorageTransferData } from 'src/transfer';
import { ItemTransferData } from 'src/types';
import { IDefaultService } from '../AbstractClasses/IDefaultService';

export abstract class IStorageService<T, O> extends IDefaultService<T, O> {
  abstract changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract addItem(dto: AddItemDto): Promise<T>;
  abstract deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData>;
  abstract searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
  abstract changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData>;
  abstract changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData>;
  abstract changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemTransferData[]>;
  abstract changeLike(dto: ChangeOpenDateDto): Promise<ItemTransferData>;
  abstract addListen(dto: AddListenDto): Promise<ItemTransferData>;
  abstract changeOpenDate(dto: ChangeLikeDto): Promise<ItemTransferData>;
  abstract checkParentsAndDelete(storage: Types.ObjectId): Promise<T>;
  abstract copyFile(dto: CopyFileDto): Promise<ItemTransferData>;
}
