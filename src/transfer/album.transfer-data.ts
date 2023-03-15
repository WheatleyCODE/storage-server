import { AlbumDocument } from 'src/album/schemas/album.schema';
import { StorageItemCommentsTransferData } from './storage-item-comments.transfer-data';
import { TrackTransferData } from './track.transfer-data';

export class AlbumTransferData extends StorageItemCommentsTransferData {
  constructor(
    album: AlbumDocument,
    readonly author = album.author,
    readonly image = album.image,
    readonly imageSize = album.imageSize,

    // ! Fix
    readonly tracks = album.tracks.map((track: any) => new TrackTransferData(track)),
  ) {
    super(album);
  }
}
