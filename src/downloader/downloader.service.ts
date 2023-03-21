import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { TrackService } from 'src/track/track.service';
import {
  IDownloadData,
  IDownloaderService,
  ItemDocument,
  ItemDto,
  ItemTypes,
  ObjectServices,
  StorageItemTypes,
} from 'src/types';
import { dtoToOjbectId } from 'src/utils';
import { VideoService } from 'src/video/video.service';

@Injectable()
export class DownloaderService implements IDownloaderService {
  private readonly objectServices: ObjectServices;

  constructor(
    readonly folderService: FolderService,
    readonly trackService: TrackService,
    readonly fileService: FileService,
    readonly albumService: AlbumService,
    readonly imageService: ImageService,
    readonly videoService: VideoService,
  ) {
    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
      [ItemTypes.IMAGE]: imageService,
      [ItemTypes.VIDEO]: videoService,
    };
  }

  async downloadArchive(dto: ItemDto[]): Promise<{ files: IDownloadData[]; archiveName: string }> {
    try {
      let files: IDownloadData[] = [];
      const items = dto.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { id, type } of items) {
        if (type === ItemTypes.FOLDER) {
          let downloadItem: ItemDocument[] = [];

          for await (const itemType of StorageItemTypes) {
            const items = await this.objectServices[itemType].getAllBy({ parent: id });
            downloadItem = [...downloadItem, ...items];
          }

          for await (const { id, type } of downloadItem) {
            const data = await this.objectServices[type].getFilePath(id);
            files = [...files, ...data];
          }
        } else {
          const downloadDataArr = await this.objectServices[type].getFilePath(id);
          files = [...files, ...downloadDataArr];
        }
      }

      const archiveName = uuid.v4();

      return { files, archiveName };
    } catch (e) {
      throw e;
    }
  }
}
