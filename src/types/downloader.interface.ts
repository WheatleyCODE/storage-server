import { ItemDto } from './core.interface';

export interface IDownloaderService {
  downloadArchive(dto: ItemDto[]): Promise<{ files: IDownloadData[]; archiveName: string }>;
}

export interface IDownloadData {
  path: string;
  name: string;
}
