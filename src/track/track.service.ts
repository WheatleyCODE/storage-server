import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReadStream } from 'fs';
import { StorageItemComments } from 'src/core';
import { FilesService } from 'src/files/files.service';
import { Track, TrackDocument } from './schemas/track.schema';
import { CommentService } from 'src/comment/comment.service';
import { TrackTransferData } from 'src/transfer';
import {
  ItemsData,
  IUpdateTrackOptions,
  ICreateTrackOptions,
  FileType,
  ITrackService,
  ItemTypes,
  IDownloadData,
  DeepPartial,
} from 'src/types';
import { CreateTrackDto } from './dto/create-track-dto';
import { delFildsByObj, dtoToOjbectId } from 'src/utils';
import { StorageService } from 'src/storage/storage.service';
import { ChangeFileDto } from 'src/album/dto/change-file.dto';
import { ChangeTrackDataDto } from './dto/change-track-data.dto';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class TrackService
  extends StorageItemComments<TrackDocument, IUpdateTrackOptions>
  implements ITrackService<TrackDocument>
{
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly filesService: FilesService,
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    commentService: CommentService,
  ) {
    super(trackModel, commentService);
  }

  async createTrack(
    dto: CreateTrackDto,
    user: Types.ObjectId,
    audio: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackTransferData> {
    try {
      const storage = await this.storageService.getOneByAndCheck({ user });

      const corDto = dtoToOjbectId(dto, ['album', 'parent']);

      const track = await this.create({
        ...corDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image?.size,
        audio,
        audioSize: audio.size,
        user,
      });

      let size = audio.size;
      if (image?.size) size += image.size;

      await this.storageService.addItem(
        {
          storage: storage._id,
          item: track._id,
          itemType: track.type,
        },
        size,
      );

      return new TrackTransferData(track);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateTrackOptions): Promise<TrackDocument> {
    try {
      let pathImage: string;

      if (options.image)
        pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);

      const pathAudio = await this.filesService.createFile(FileType.AUDIO, options.audio);
      const fileExt = pathAudio.split('.').pop();

      return await this.trackModel.create({
        ...options,
        type: ItemTypes.TRACK,
        file: pathAudio,
        fileSize: options.audioSize,
        fileExt,
        image: pathImage,
        createDate: Date.now(),
        changeDate: Date.now(),
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<TrackDocument & ItemsData> {
    try {
      const deletedTrack = await this.trackModel.findByIdAndDelete(id);
      if (!deletedTrack) throw new HttpException('Трек не найден', HttpStatus.BAD_REQUEST);

      const albumId = deletedTrack.album;

      if (albumId) {
        const album = await this.albumService.getOneById(deletedTrack.album);

        if (album) {
          album.tracks = [...album.tracks].filter(
            (id) => id.toString() !== deletedTrack._id.toString(),
          );

          await album.save();
        }
      }

      await this.filesService.removeFile(deletedTrack.file);

      if (deletedTrack.image) {
        await this.filesService.removeFile(deletedTrack.image);
      }

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedTrack],
        size: deletedTrack.fileSize + (deletedTrack.imageSize || 0),
      };

      return Object.assign(deletedTrack, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async changeFile(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    audio: Express.Multer.File,
  ): Promise<TrackTransferData> {
    try {
      const { id } = dtoToOjbectId(dto, ['id']);
      const trackDoc = await this.changeDate(id, ['changeDate']);

      await this.storageService.changeUsedSpace(user, trackDoc.fileSize, audio.size);

      const newPathAudio = await this.filesService.changeFile(FileType.AUDIO, audio, trackDoc.file);
      trackDoc.file = newPathAudio;
      trackDoc.fileSize = audio.size;

      await trackDoc.save();

      return new TrackTransferData(trackDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeImage(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<TrackTransferData> {
    try {
      const { id } = dtoToOjbectId(dto, ['id']);
      const trackDoc = await this.changeDate(id, ['changeDate']);

      await this.storageService.changeUsedSpace(user, trackDoc.imageSize, image.size);

      const newPathImage = await this.filesService.changeFile(
        FileType.IMAGE,
        image,
        trackDoc.image,
      );

      trackDoc.image = newPathImage;
      trackDoc.imageSize = image.size;

      await trackDoc.save();

      return new TrackTransferData(trackDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeData(dto: ChangeTrackDataDto): Promise<TrackTransferData> {
    try {
      const { id, name, author, text } = dtoToOjbectId(dto, ['id']);
      await this.changeDate(id, ['changeDate']);
      const trackDoc = await this.update(id, { name, author, text });
      return new TrackTransferData(trackDoc);
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<TrackDocument & ItemsData> {
    try {
      const track = await this.findByIdAndCheck(id);
      const { user, name, author, isTrash, text, imageSize, fileSize, parent, fileExt, type } =
        track;

      let imageNewPath;

      if (track.image) {
        imageNewPath = await this.filesService.copyFile(track.image, FileType.IMAGE);
      }

      const audioNewPath = await this.filesService.copyFile(track.file, FileType.AUDIO);

      const newTrack = await this.trackModel.create({
        type,
        user,
        name: `${name} copy`,
        author,
        text,
        parent,
        imageSize,
        fileSize,
        fileExt,
        isTrash,
        file: audioNewPath,
        image: imageNewPath,
        createDate: Date.now(),
        openDate: Date.now(),
        changeDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newTrack],
        size: fileSize + (imageSize || 0),
      };

      return Object.assign(newTrack, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<IDownloadData[]> {
    try {
      const { name, file, fileExt, image } = await this.findByIdAndCheck(id);
      const imagePath = await this.filesService.getFilePath(image);
      const imageExt = imagePath.split('.').pop();
      const imageName = `${name}-img.${imageExt}`;

      const filePath = await this.filesService.getFilePath(file);
      const fileName = `${name}.${fileExt}`;

      return [
        { path: filePath, name: fileName },
        { path: imagePath, name: imageName },
      ];
    } catch (e) {
      throw e;
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<TrackDocument[]> {
    try {
      const deletedTracks: TrackDocument[] = [];

      for await (const id of ids) {
        const deleteTrack = await this.delete(id);

        deletedTracks.push(deleteTrack);
      }

      return deletedTracks;
    } catch (e) {
      throw new HttpException(
        'Ошибка при удалении треков по IDS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restore(id: Types.ObjectId, options: DeepPartial<TrackDocument>): Promise<TrackDocument> {
    try {
      const updateData = delFildsByObj<
        DeepPartial<TrackDocument>,
        'file' | 'fileExt' | 'fileSize' | 'image' | 'imageSize' | 'album'
      >(options, ['file', 'fileExt', 'fileSize', 'image', 'imageSize', 'album']);

      console.log(updateData);
      const newdd = await this.update(id, updateData);
      console.log(newdd);

      return newdd;
    } catch (e) {
      throw e;
    }
  }
}
