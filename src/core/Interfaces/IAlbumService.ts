import { Types } from 'mongoose';
import { ChangeTracksDto } from 'src/album/dto/ChangeTracks.dto';
import { IDefaultFile } from '../AbstractClasses/IDefaultFile';

export abstract class IAlbumService<T, O> extends IDefaultFile<T, O> {
  abstract changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
  abstract changeTracks(dto: ChangeTracksDto): Promise<T>;
}
