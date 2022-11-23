import { Types } from 'mongoose';
import { VideoTransferData } from 'src/transfer';
import { IDefaultFile } from '../AbstractClasses/IDefaultFile';

export abstract class IVideoService<T, O> extends IDefaultFile<T, O> {
  abstract changeFiles(
    id: Types.ObjectId,
    video?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<T>;
  abstract getAllPublicVideos(count: number, offset: number): Promise<VideoTransferData[]>;
  abstract searchPublicVideos(
    text: string,
    count: number,
    offset: number,
  ): Promise<VideoTransferData[]>;
}
