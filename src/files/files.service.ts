import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FilesService {
  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      // Todo переписать на асинхронные методы

      const randomString = uuid.v4();
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${randomString}.${fileExtension}`;
      const filePath = path.resolve(__dirname, '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFile(pathDB: string): Promise<boolean> {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', pathDB);
      fs.unlinkSync(filePath);

      return true;
    } catch (e) {
      throw new HttpException('Ошибка при удалении файла', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
