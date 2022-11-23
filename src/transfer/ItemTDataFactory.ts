import { HttpException, HttpStatus } from '@nestjs/common';
import { ItemTransferData, ItemTypes } from 'src/types';
import { AlbumTransferData } from './AlbumTransferData';
import { FileTransferData } from './FileTransferData';
import { FolderTransferData } from './FolderTransferData';
import { ImageTransferData } from './ImageTransferData';
import { TrackTransferData } from './TrackTransferData';
import { VideoTransferData } from './VideoTransferData';

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
