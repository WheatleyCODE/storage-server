import { AlbumDocument } from 'src/album/schemas/album.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';

export class AlbumTransferData extends StorageItemCommentsTransferData {
  constructor(
    album: AlbumDocument,
    readonly author = album.author,
    readonly image = album.image,
    readonly imageSize = album.imageSize,
    readonly tracks = album.tracks,
  ) {
    super(album);
  }
}
