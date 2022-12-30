import { ItemDocument } from 'src/types';
import { StorageItemTransferData } from './storage-item.transfer-data';

export class StorageItemCommentsTransferData extends StorageItemTransferData {
  constructor(item: ItemDocument, readonly comments = item.comments) {
    super(item);
  }
}
