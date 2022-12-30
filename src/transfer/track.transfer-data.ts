import { TrackDocument } from 'src/track/schemas/track.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';

export class TrackTransferData extends StorageItemCommentsTransferData {
  constructor(
    track: TrackDocument,
    readonly author = track.author,
    readonly text = track.text,
    readonly image = track.image,
    readonly imageSize = track.imageSize,
    readonly file = track.file,
    readonly fileSize = track.fileSize,
    readonly fileExt = track.fileExt,
  ) {
    super(track);
  }
}
