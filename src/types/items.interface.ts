import { Types } from 'mongoose';
import { ChangeIsTrashDto } from 'src/items/dto/change-is-trash.dto';
import { CopyItemDto } from 'src/items/dto/copy-item.dto';
import { CreateAccessLinkDto } from 'src/items/dto/create-access-link.dto';
import { DeleteItemDto } from 'src/items/dto/delete-item.dto';
import { ChildrensTransferData, ItemTransferData } from './core.interface';
import { ChangeParentDto } from 'src/items/dto/change-parent.dto';
import { ChangeAccessTypeDto } from 'src/items/dto/change-access-type.dto';
import { ChangeLikeDto } from 'src/items/dto/change-like.dto';
import { AddListenDto } from 'src/items/dto/add-listen.dto';
import { ChangeNameDto } from 'src/items/dto/change-name.dto';
import { StorageTransferData } from 'src/transfer';

export interface IItemsService {
  deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData>;
  changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData[]>;
  changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData>;
  changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemTransferData[]>;
  changeLike(dto: ChangeLikeDto): Promise<ItemTransferData>;
  addListen(dto: AddListenDto): Promise<ItemTransferData>;
  copyItem(dto: CopyItemDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
  changeName(dto: ChangeNameDto): Promise<ItemTransferData>;
  changeParent(dto: ChangeParentDto): Promise<ItemTransferData[]>;
  getChildrens(id: Types.ObjectId): Promise<ChildrensTransferData>;
}

export type DateFilds = 'openDate' | 'changeDate' | 'createDate';
