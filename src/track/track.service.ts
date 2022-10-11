import { CreateTrackOptions, TrackTransferData } from './../types/track';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ITrackService } from 'src/core/Interfaces/ITrackService';
import { FilesService, FileType } from 'src/files/files.service';
import { AccessTypes, ItemsData, UpdateTrackOptions } from 'src/types';
import { Track, TrackDocument } from './schemas/track.schema';
import { ReadStream } from 'fs';

@Injectable()
export class TrackService extends ITrackService<TrackDocument, UpdateTrackOptions> {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly filesService: FilesService,
  ) {
    super(trackModel);
  }

  async create(options: CreateTrackOptions): Promise<TrackDocument> {
    try {
      let pathImage: string;

      if (options.image)
        pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);

      const pathAudio = await this.filesService.createFile(FileType.AUDIO, options.audio);

      return await this.trackModel.create({
        ...options,
        audio: pathAudio,
        image: pathImage,
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<TrackDocument & ItemsData> {
    try {
      const deletedTrack = await this.trackModel.findByIdAndDelete(id);

      if (!deletedTrack) throw new HttpException('Трек не найден', HttpStatus.BAD_REQUEST);

      await this.filesService.removeFile(deletedTrack.audio);
      await this.filesService.removeFile(deletedTrack.image);

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedTrack],
        size: deletedTrack.audioSize + (deletedTrack.imageSize || 0),
      };

      return Object.assign(deletedTrack, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async searchPublicTracks(text: string, count = 10, offset = 0): Promise<TrackTransferData[]> {
    try {
      const tracks = await this.trackModel
        .find({ name: { $regex: new RegExp(text, 'i') } })
        .skip(offset)
        .limit(count);
      return tracks.map((track) => new TrackTransferData(track));
    } catch (e) {
      throw new HttpException('Ошибка при поиске треков', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeFiles(
    id: Types.ObjectId,
    audio?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackDocument> {
    try {
      const track = await this.findByIdAndCheck(id);

      if (audio) {
        const newPathAudio = await this.filesService.changeFile(FileType.AUDIO, audio, track.audio);
        track.audio = newPathAudio;
        track.audioSize = audio.size;
      }

      if (image) {
        const newPathImage = await this.filesService.changeFile(FileType.IMAGE, image, track.image);
        track.image = newPathImage;
        track.imageSize = image.size;
      }

      return await track.save();
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<TrackDocument & ItemsData> {
    try {
      const track = await this.findByIdAndCheck(id);
      const { user, name, author, isTrash, text, imageSize, audioSize } = track;

      const imageNewPath = await this.filesService.copyFile(track.image, FileType.IMAGE);
      const audioNewPath = await this.filesService.copyFile(track.audio, FileType.AUDIO);

      const newTrack = await this.trackModel.create({
        user,
        name: `${name} copy`,
        author,
        text,
        imageSize,
        audioSize,
        isTrash,
        audio: imageNewPath,
        image: audioNewPath,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newTrack],
        size: audioSize + (imageSize || 0),
      };

      return Object.assign(newTrack, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<ReadStream> {
    try {
      const track = await this.findByIdAndCheck(id);
      const file = await this.filesService.downloadFile(track.audio);
      return file;
    } catch (e) {
      throw e;
    }
  }

  async getAllPublicTracks(count = 10, offset = 0): Promise<TrackTransferData[]> {
    try {
      const tracks = await this.trackModel
        .find({ accessType: AccessTypes.PUBLIC })
        .skip(offset)
        .limit(count);

      return tracks.map((track) => new TrackTransferData(track));
    } catch (e) {
      throw new HttpException('Ошибка при поиске треков', HttpStatus.INTERNAL_SERVER_ERROR);
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
}
