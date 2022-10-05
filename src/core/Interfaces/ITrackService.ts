import { Types } from 'mongoose';
import { Pagination, TrackTransferData } from 'src/types';
import { IDefaultFile } from '../AbstractClasses/IDefaultFile';

export abstract class ITrackService<T, O> extends IDefaultFile<T, O> {
  abstract changeImage(id: Types.ObjectId): Promise<T>;
  abstract changeAudio(id: Types.ObjectId): Promise<T>;
  abstract getAllToDto(pag: Pagination): Promise<TrackTransferData[]>;
  abstract getOneByIdToDto(id: Types.ObjectId): Promise<TrackTransferData>;
}
