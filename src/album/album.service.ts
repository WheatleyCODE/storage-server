import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { delFildsByObj, dtoToOjbectId } from 'src/utils';
import {
  ItemsData,
  FileType,
  IAlbumService,
  ICreateAlbumOptions,
  IUpdateAlbumOptions,
  ItemTypes,
  IDownloadData,
  DeepPartial,
} from 'src/types';
import { CreateAlbumDto } from './dto/create-album.dto';
import { StorageService } from 'src/storage/storage.service';
import { ChangeFileDto } from './dto/change-file.dto';
import { ChangeAlbumDataDto } from './dto/change-album-data.dto';

@Injectable()
export class AlbumService
  extends StorageItemComments<AlbumDocument, IUpdateAlbumOptions>
  implements IAlbumService
{
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    private readonly storageService: StorageService,
    commentService: CommentService,
  ) {
    super(albumModel, commentService);
  }

  async changeData(dto: ChangeAlbumDataDto): Promise<AlbumTransferData> {
    try {
      const { id, name, author } = dtoToOjbectId(dto, ['id']);
      await this.changeDate(id, ['changeDate']);

      const albumDoc = await this.update(id, { name, author });
      await albumDoc.populate('tracks');
      return new AlbumTransferData(albumDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeTracks(dto: ChangeTracksDto): Promise<AlbumTransferData> {
    try {
      const { id, tracks } = dtoToOjbectId(dto, ['id', 'tracks']);
      const albumDoc = await this.changeDate(id, ['changeDate']);

      await albumDoc.populate('tracks');
      const trackDocs: TrackDocument[] = [];

      for await (const track of tracks) {
        const trackDoc = await this.trackService.getOneByIdAndCheck(track);
        trackDocs.push(trackDoc);
      }

      for await (const doc of trackDocs) {
        doc.album = albumDoc._id;
        await doc.save();
      }

      albumDoc.tracks = [...trackDocs] as any;
      await albumDoc.save();
      await albumDoc.populate('tracks');

      return new AlbumTransferData(albumDoc);
    } catch (e) {
      throw e;
    }
  }

  async getChildrens(parent: Types.ObjectId): Promise<AlbumDocument[]> {
    try {
      const albumDoc = await this.findAllBy({ parent } as any);

      for await (const album of albumDoc) {
        await album.populate('tracks');
      }

      return await albumDoc;
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
      const albumDoc = await this.changeDate(id, ['changeDate']);

      await this.storageService.changeUsedSpace(user, albumDoc.imageSize, file.size);

      const newPathImage = await this.filesService.changeFile(FileType.IMAGE, file, albumDoc.image);
      albumDoc.image = newPathImage;
      albumDoc.imageSize = file.size;

      await albumDoc.populate('tracks');
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

      const correctDto = dtoToOjbectId(dto, ['parent', 'tracks']);

      const album = await this.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image.size,
        user,
      });

      await album.populate('tracks');

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

  async getFilePath(id: Types.ObjectId): Promise<IDownloadData[]> {
    try {
      const albumDoc = await this.findByIdAndCheck(id);
      const { name, image, tracks } = albumDoc;

      let trackDatas: IDownloadData[] = [];

      for await (const track of tracks) {
        const trackData = await this.trackService.getFilePath(track);
        trackDatas = [...trackDatas, ...trackData];
      }

      const path = await this.filesService.getFilePath(image);
      const ext = image.split('.').pop();

      const imageName = `${name}.${ext}`;

      return [{ path, name: imageName }, ...trackDatas];
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<AlbumDocument & ItemsData> {
    try {
      const album = await this.findByIdAndCheck(id);
      const { user, name, isTrash, image, imageSize, author, parent, type } = album;

      const imageNewPath = await this.filesService.copyFile(image, FileType.IMAGE);

      const newAlbum = await this.albumModel.create({
        type,
        user,
        author,
        parent,
        name: `${name} copy`,
        isTrash,
        image: imageNewPath,
        imageSize,
        createDate: Date.now(),
        openDate: Date.now(),
        changeDate: Date.now(),
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
      await newAlbum.populate('tracks');

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

  async changeStar(id: Types.ObjectId, isStar: boolean): Promise<AlbumDocument> {
    const album = await super.changeStar(id, isStar);
    await album.populate('tracks');
    return album;
  }

  async changeLike(
    id: Types.ObjectId,
    user: Types.ObjectId,
    isLike: boolean,
  ): Promise<AlbumDocument> {
    const album = await super.changeLike(id, user, isLike);
    await album.populate('tracks');
    return album;
  }

  async restore(id: Types.ObjectId, options: DeepPartial<AlbumDocument>): Promise<AlbumDocument> {
    try {
      const updateData = delFildsByObj<
        DeepPartial<AlbumDocument>,
        'image' | 'imageSize' | 'tracks'
      >(options, ['image', 'imageSize', 'tracks']);

      return await this.update(id, updateData);
    } catch (e) {
      throw e;
    }
  }
}
