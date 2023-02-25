import { Types } from 'mongoose';
import { UploadFilesDto } from 'src/uploader/dto/upload-files.dto';
import { ItemTransferData } from './core.interface';

export interface IUploaderService {
  uploadFiles(
    dto: UploadFilesDto,
    user: Types.ObjectId,
    files: Express.Multer.File[],
  ): Promise<ItemTransferData[]>;
}
