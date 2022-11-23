import { Types } from 'mongoose';
import { StorageCollectionsPopulated } from 'src/types';
import { AlbumTransferData } from './AlbumTransferData';
import { FileTransferData } from './FileTransferData';
import { FolderTransferData } from './FolderTransferData';
import { ImageTransferData } from './ImageTransferData';
import { TrackTransferData } from './TrackTransferData';
import { VideoTransferData } from './VideoTransferData';

export class StorageTransferData {
  constructor(
    storage: StorageCollectionsPopulated,
    readonly id: Types.ObjectId = storage._id,
    readonly name = storage.name,
    readonly user = storage.user,
    readonly diskSpace = storage.diskSpace,
    readonly usedSpace = storage.usedSpace,
    readonly folders = storage.folders.map((folder) => new FolderTransferData(folder)),
    readonly tracks = storage.tracks.map((track) => new TrackTransferData(track)),
    readonly files = storage.files.map((file) => new FileTransferData(file)),
    readonly albums = storage.albums.map((album) => new AlbumTransferData(album)),
    readonly images = storage.images.map((image) => new ImageTransferData(image)),
    readonly videos = storage.videos.map((video) => new VideoTransferData(video)),
  ) {}
}
