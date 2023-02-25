import { Types } from 'mongoose';
import { SearchItemDto } from 'src/finder/dto/search-item.dto';
import { ItemTransferData } from './core.interface';

export interface IFinderService {
  searchStorageItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
  searchPublicItems(text: string, count: number, offset: number): Promise<ItemTransferData[]>;
  getAllPublicItems(count: number, offset: number): Promise<ItemTransferData[]>;
}
