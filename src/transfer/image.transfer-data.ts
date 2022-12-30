import { ImageDocument } from 'src/image/schemas/image.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';

export class ImageTransferData extends StorageItemCommentsTransferData {
  constructor(
    imageDoc: ImageDocument,
    readonly file = imageDoc.file,
    readonly fileSize = imageDoc.fileSize,
    readonly fileExt = imageDoc.fileExt,
  ) {
    super(imageDoc);
  }
}
