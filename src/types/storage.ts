import { Types } from 'mongoose';

export type CreateStorageOptions = {
  user: Types.ObjectId;
  name: string;
  diskSpace?: number;
  usedSpace?: number;
  folders?: Types.ObjectId[];
};

export type UpdateStorageOptions = {
  user?: Types.ObjectId;
  name?: string;
  diskSpace?: number;
  usedSpace?: number;
  folders?: Types.ObjectId[];
};
