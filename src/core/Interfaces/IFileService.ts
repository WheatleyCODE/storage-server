import { Types } from 'mongoose';
import { IDefaultFile } from '../AbstractClasses/IDefaultFile';

export abstract class IFileService<T, O> extends IDefaultFile<T, O> {
  abstract changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
}
