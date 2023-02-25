import { StreamableFile } from '@nestjs/common';
import { ItemDto } from './core.interface';

export interface IDownloaderService {
  downloadFile(dto: ItemDto): Promise<{ file: StreamableFile; filename: string }>;
  downloadArchive(dto: ItemDto[]): Promise<{ path: string; name: string }[]>;
}
