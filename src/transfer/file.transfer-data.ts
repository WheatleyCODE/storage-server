import { FileDocument } from 'src/file/schemas/file.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';

export class FileTransferData extends StorageItemCommentsTransferData {
  constructor(
    filedoc: FileDocument,
    readonly file = filedoc.file,
    readonly fileSize = filedoc.fileSize,
    readonly fileExt = filedoc.fileExt,
  ) {
    super(filedoc);
  }
}
