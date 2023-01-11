import { Types } from 'mongoose';
import { AddListenDto } from 'src/storage/dto/add-listen.dto';
import { ChangeAccessTypeDto } from 'src/storage/dto/change-access-type.dto';
import { ChangeIsTrashDto } from 'src/storage/dto/change-is-trash.dto';
import { ChangeLikeDto } from 'src/storage/dto/change-like.dto';
import { ChangeOpenDateDto } from 'src/storage/dto/change-open-date.dto';
import { CopyFileDto } from 'src/storage/dto/copy-file.dto';
import { CreateAccessLinkDto } from 'src/storage/dto/create-access-link.dto';
import { DeleteItemDto } from 'src/storage/dto/delete-item.dto';
import { SearchItemDto } from 'src/storage/dto/search-item.dto';
import { StorageTransferData } from 'src/transfer';
import { ItemTransferData } from './core.interface';

export interface IItemsService {
  deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData>;
  searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
  changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData>;
  changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData>;
  changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemTransferData[]>;
  changeLike(dto: ChangeOpenDateDto): Promise<ItemTransferData>;
  addListen(dto: AddListenDto): Promise<ItemTransferData>;
  changeOpenDate(dto: ChangeLikeDto): Promise<ItemTransferData>;
  copyFile(dto: CopyFileDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
}
