import { FileType } from './file.interface';
export interface IFilesService {
  createFile(type: FileType, file: Express.Multer.File): Promise<string>;
  removeFile(pathDB: string): Promise<boolean>;
  changeFile(type: FileType, file: Express.Multer.File, pathDB: string): Promise<string>;
  copyFile(pathDB: string, type: FileType): Promise<string>;
  getFilePath(pathDB: string): string;
}
