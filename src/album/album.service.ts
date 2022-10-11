import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { IAlbumService } from 'src/core/Interfaces/IAlbumService';
import { FilesService, FileType } from 'src/files/files.service';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { TrackService } from 'src/track/track.service';
import { ItemsData } from 'src/types';
import { CreateAlbumOptions, UpdateAlbumOptions } from 'src/types/album';
import { dtoToOjbectId } from 'src/utils';
import { ChangeTracksDto } from './dto/ChangeTracks.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService extends IAlbumService<AlbumDocument, UpdateAlbumOptions> {
  async changeTracks(dto: ChangeTracksDto): Promise<AlbumDocument> {
    try {
      const { album, tracks, isDelete } = dtoToOjbectId(dto, ['album', 'tracks']);
      const albumDoc = await this.findByIdAndCheck(album);

      for await (const track of tracks) {
        const trackDoc = await this.trackService.getOneById(track);

        if (!trackDoc)
          throw new HttpException('Ошибка при изменении треков в альбоме', HttpStatus.BAD_REQUEST);

        trackDoc.album = isDelete ? undefined : albumDoc._id;
        await trackDoc.save();
      }

      if (isDelete) {
        const delTracks = tracks.map((ids) => ids.toString());
        albumDoc.tracks = albumDoc.tracks.filter((itm) => !delTracks.includes(itm.toString()));
        return await albumDoc.save();
      }

      albumDoc.tracks = [...albumDoc.tracks, ...tracks];
      return await albumDoc.save();
    } catch (e) {
      throw e;
    }
  }

  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly filesService: FilesService,
    private readonly trackService: TrackService,
  ) {
    super(albumModel);
  }

  async create(options: CreateAlbumOptions): Promise<AlbumDocument> {
    try {
      const pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);

      return await this.albumModel.create({
        ...options,
        image: pathImage,
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

  async changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<AlbumDocument> {
    try {
      const albumDoc = await this.findByIdAndCheck(id);

      const newPathImage = await this.filesService.changeFile(FileType.IMAGE, file, albumDoc.image);
      albumDoc.image = newPathImage;
      albumDoc.imageSize = file.size;

      return await albumDoc.save();
    } catch (e) {
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<ReadStream> {
    try {
      // Todo реализовать метод, когда будешь делать клиент
      throw new Error('Method not implemented.');
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<AlbumDocument & ItemsData> {
    try {
      const album = await this.findByIdAndCheck(id);
      const { user, name, isTrash, image, imageSize } = album;

      const imageNewPath = await this.filesService.copyFile(image, FileType.IMAGE);

      const newAlbum = await this.albumModel.create({
        user,
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
