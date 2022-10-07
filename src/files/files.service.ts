import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import * as uuid from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FilesService {
  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      const { fileName, filePath } = this.generateFileName(file.originalname, type);

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

  async changeFile(type: FileType, file: Express.Multer.File, pathDB: string): Promise<string> {
    try {
      if (!pathDB) {
        const path = await this.createFile(type, file);
        return path;
      }

      const success = await this.removeFile(pathDB);

      if (success) {
        const path = await this.createFile(type, file);
        return path;
      }

      throw new HttpException('Ошибка при изменении файла', HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (e) {
      throw e;
    }
  }

  private generateFileName(
    prevFileName: string,
    type: FileType,
  ): { fileName: string; filePath: string } {
    const randomString = uuid.v4();
    const fileExtension = prevFileName.split('.').pop();
    const fileName = `${randomString}.${fileExtension}`;
    const filePath = path.resolve(__dirname, '..', 'static', type);

    return {
      fileName,
      filePath,
    };
  }

  async copyFile(pathDB: string, type: FileType): Promise<string> {
    try {
      const { fileName, filePath } = this.generateFileName(pathDB, type);
      const srcPath = path.resolve(__dirname, '..', 'static', pathDB);
      const destPath = path.resolve(filePath, fileName);

      fs.copyFileSync(srcPath, destPath);

      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException('Ошибка при копировании файла', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async downloadFile(pathDB: string): Promise<fs.ReadStream> {
    try {
      const srcPath = path.resolve(__dirname, '..', 'static', pathDB);
      const file = fs.createReadStream(srcPath);

      return file;
    } catch (e) {
      throw new HttpException('Ошибка скачке файла', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
