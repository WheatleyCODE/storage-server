import { VideoDocument } from 'src/video/schemas/video.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';

export class VideoTransferData extends StorageItemCommentsTransferData {
  constructor(
    videoDoc: VideoDocument,
    readonly description = videoDoc.description,
    readonly image = videoDoc.image,
    readonly imageSize = videoDoc.imageSize,
    readonly file = videoDoc.file,
    readonly fileSize = videoDoc.fileSize,
    readonly fileExt = videoDoc.fileExt,
  ) {
    super(videoDoc);
  }
}
