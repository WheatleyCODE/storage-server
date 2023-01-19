import { ItemTransferData } from './core.interface';

export interface IFinderService {
  searchPublicItems(text: string, count: number, offset: number): Promise<ItemTransferData[]>;
  getAllPublicItems(count: number, offset: number): Promise<ItemTransferData[]>;
}
