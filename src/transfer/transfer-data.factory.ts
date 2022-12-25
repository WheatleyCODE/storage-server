import { HttpException, HttpStatus } from '@nestjs/common';
import { ItemTransferData, ItemTypes } from 'src/types';
import { AlbumTransferData } from './album.transfer-data';
import { FileTransferData } from './file.transfer-data';
import { FolderTransferData } from './folder.transfer-data';
import { ImageTransferData } from './image.transfer-data';
import { TrackTransferData } from './track.transfer-data';
import { VideoTransferData } from './video.transfer-data';

// ! rename
export abstract class ItemTDataFactory {
  static list = {
    [ItemTypes.FOLDER]: FolderTransferData,
    [ItemTypes.FILE]: FileTransferData,
    [ItemTypes.TRACK]: TrackTransferData,
    [ItemTypes.ALBUM]: AlbumTransferData,
    [ItemTypes.IMAGE]: ImageTransferData,
    [ItemTypes.VIDEO]: VideoTransferData,
  };

  static create(document: any): ItemTransferData {
    const TransferData = ItemTDataFactory.list[document?.type || 'error'];

    if (!TransferData) {
      throw new HttpException(
        'Ошибка при генерации ItemTransferData',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return new TransferData(document);
  }
}
