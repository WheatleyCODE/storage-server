import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { StorageItemComments } from 'src/core';
import { FilesService } from 'src/files/files.service';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { TrackService } from 'src/track/track.service';
import { Album, AlbumDocument } from './schemas/album.schema';
import { ChangeTracksDto } from './dto/change-tracks.dto';
import { AlbumTransferData } from 'src/transfer';
import { dtoToOjbectId } from 'src/utils';
import {
  ItemsData,
  FileType,
  IAlbumService,
  ICreateAlbumOptions,
  IUpdateAlbumOptions,
  ItemTypes,
} from 'src/types';
import { CreateAlbumDto } from './dto/create-album.dto';
import { StorageService } from 'src/storage/storage.service';
import { ChangeFileDto } from './dto/change-file.dto';

@Injectable()
export class AlbumService
  extends StorageItemComments<AlbumDocument, IUpdateAlbumOptions>
  implements IAlbumService
{
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly filesService: FilesService,
    private readonly trackService: TrackService,
    private readonly storageService: StorageService,
    commentService: CommentService,
  ) {
    super(albumModel, commentService);
  }

  // ! Fix
  async changeTracks(dto: ChangeTracksDto, user: Types.ObjectId): Promise<AlbumTransferData> {
    try {
      const { id, tracks } = dtoToOjbectId(dto, ['id', 'tracks']);
      let albumDoc = await this.findByIdAndCheck(id);
      albumDoc = await albumDoc.populate('tracks');
      const trackDocs: TrackDocument[] = [];

      for await (const track of tracks) {
        const trackDoc = await this.trackService.getOneByIdAndCheck(track);
        trackDocs.push(trackDoc);
      }

      for await (const doc of trackDocs) {
        doc.album = albumDoc._id;
        await doc.save();
      }

      return new AlbumTransferData(albumDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeImage(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<AlbumTransferData> {
    try {
      const { id } = dtoToOjbectId(dto, ['id']);
      const albumDoc = await this.findByIdAndCheck(id);

      await this.storageService.changeUsedSpace(user, albumDoc.imageSize, file.size);

      const newPathImage = await this.filesService.changeFile(FileType.IMAGE, file, albumDoc.image);
      albumDoc.image = newPathImage;
      albumDoc.imageSize = file.size;

      await albumDoc.save();

      return new AlbumTransferData(albumDoc);
    } catch (e) {
      throw e;
    }
  }

  async createAlbum(
    dto: CreateAlbumDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<AlbumTransferData> {
    try {
      const storage = await this.storageService.getOneByAndCheck({ user });

      const correctDto = dtoToOjbectId(dto, ['parent']);

      const album = await this.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image.size,
        user,
      });

      await this.storageService.addItem(
        {
          storage: storage._id,
          item: album._id,
          itemType: album.type,
        },
        album.imageSize,
      );

      return new AlbumTransferData(album);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateAlbumOptions): Promise<AlbumDocument> {
    try {
      const pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);

      return await this.albumModel.create({
        ...options,
        type: ItemTypes.ALBUM,
        image: pathImage,
        createDate: Date.now(),
        changeDate: Date.now(),
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<AlbumDocument & ItemsData> {
    try {
      const album = await this.findByIdAndCheck(id);
      const deletedTracks: TrackDocument[] = [];
      let size = 0;

      for await (const track of album.tracks) {
        const delTrack = await this.trackService.delete(track);
        deletedTracks.push(delTrack);
        size += delTrack.size;
      }

      const deletedAlbum = await this.albumModel.findByIdAndDelete(id);

      await this.filesService.removeFile(album.image);

      const itemsData: ItemsData = {
        count: deletedTracks.length + 1,
        items: [deletedAlbum, ...deletedTracks],
        size: deletedAlbum.imageSize + size,
      };

      return Object.assign(deletedAlbum, itemsData);
    } catch (e) {
      throw e;
    }
  }

  // ! Fix Альбом должен скачиваться адним архивом, с треками
  async download(id: Types.ObjectId): Promise<{ file: ReadStream; filename: string }> {
    try {
      const albumDoc = await this.findByIdAndCheck(id);
      const file = await this.filesService.downloadFile(albumDoc.image);
      const ext = albumDoc.image.split('.')[1];
      const filename = `${albumDoc.name}.${ext}`;

      return { file, filename };
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<{ path: string; filename: string }> {
    try {
      const albumDoc = await this.findByIdAndCheck(id);
      const path = await this.filesService.getFilePath(albumDoc.image);
      const ext = albumDoc.image.split('.')[1];
      const filename = `${albumDoc.name}.${ext}`;

      return { path, filename };
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<AlbumDocument & ItemsData> {
    try {
      const album = await this.findByIdAndCheck(id);
      const { user, name, isTrash, image, imageSize, author, parent } = album;

      const imageNewPath = await this.filesService.copyFile(image, FileType.IMAGE);

      const newAlbum = await this.albumModel.create({
        user,
        author,
        parent,
        name: `${name} copy`,
        isTrash,
        image: imageNewPath,
        imageSize,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      let size = 0;
      const newTracks: TrackDocument[] = [];

      for await (const track of album.tracks) {
        const newTrack = await this.trackService.copy(track);
        newTrack.album = newAlbum._id;

        await newTrack.save();

        size += newTrack.size;
        newTracks.push(newTrack);
      }

      newAlbum.tracks = newTracks.map((track) => track._id);
      await newAlbum.save();

      const itemsData: ItemsData = {
        count: newTracks.length + 1,
        items: [...newTracks, newAlbum],
        size: imageSize + size,
      };

      return Object.assign(newAlbum, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<AlbumDocument[]> {
    try {
      const deletedAlbums: AlbumDocument[] = [];

      for await (const id of ids) {
        const deleteAlbum = await this.delete(id);

        deletedAlbums.push(deleteAlbum);
      }

      return deletedAlbums;
    } catch (e) {
      throw new HttpException(
        'Ошибка при удалении альбомов по IDS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
