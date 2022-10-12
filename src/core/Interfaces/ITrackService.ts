import { Types } from 'mongoose';
import { TrackTransferData } from 'src/transfer';
import { IDefaultFile } from '../AbstractClasses/IDefaultFile';

export abstract class ITrackService<T, O> extends IDefaultFile<T, O> {
  abstract changeFiles(
    id: Types.ObjectId,
    audio?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<T>;
  abstract getAllPublicTracks(count: number, offset: number): Promise<TrackTransferData[]>;
  abstract searchPublicTracks(
    text: string,
    count: number,
    offset: number,
  ): Promise<TrackTransferData[]>;
}
