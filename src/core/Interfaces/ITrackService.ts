import { Types } from 'mongoose';
import { FileType } from 'src/files/files.service';
import { Pagination, TrackTransferData } from 'src/types';
import { IDefaultFile } from '../AbstractClasses/IDefaultFile';

export abstract class ITrackService<T, O> extends IDefaultFile<T, O> {
  abstract changeFile(
    id: Types.ObjectId,
    image: Express.Multer.File,
    fileType: FileType,
  ): Promise<T>;
  abstract getAllPublicTracks(pag?: Pagination): Promise<TrackTransferData[]>;
  abstract searchPublicTracks(text: string, pag?: Pagination): Promise<TrackTransferData[]>;
}
