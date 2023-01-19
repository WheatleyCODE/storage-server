import { Injectable, StreamableFile } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { TrackService } from 'src/track/track.service';
import { ItemFileDto, ItemTypes, ObjectServices } from 'src/types';
import { dtoToOjbectId } from 'src/utils';
import { VideoService } from 'src/video/video.service';

@Injectable()
export class DownloaderService {
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

  async downloadFile(dto: ItemFileDto): Promise<{ file: StreamableFile; filename: string }> {
    try {
      const { id, type } = dtoToOjbectId(dto, ['id']);
      const { file, filename } = await this.objectServices[type].download(id);
      return { file: new StreamableFile(file), filename };
    } catch (e) {
      throw e;
    }
  }

  async downloadArchive(dto: ItemFileDto[]): Promise<{ path: string; name: string }[]> {
    try {
      const pathArr: { path: string; name: string }[] = [];
      const items = dto.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { id, type } of items) {
        const { path, filename } = await this.objectServices[type].getFilePath(id);
        pathArr.push({ path, name: filename });
      }

      return pathArr;
    } catch (e) {
      throw e;
    }
  }
}
