import { Types } from 'mongoose';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { ImageTransferData } from 'src/transfer/image.transfer-data';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';

export interface IImageService<T> {
  createImage(
    dto: CreateImageDto,
    user: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<ImageTransferData>;
}

export interface ICreateImageOptions {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  image: Express.Multer.File;
  imageSize: number;
}

export interface IUpdateImageOptions extends DeepPartial<ICreateImageOptions> {}
