import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';

export class FolderTransferData extends StorageItemCommentsTransferData {
  constructor(folder: FolderDocument, readonly color = folder.color) {
    super(folder);
  }
}
