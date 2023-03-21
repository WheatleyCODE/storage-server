import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReadStream } from 'fs';
import { StorageItemComments } from 'src/core';
import { CommentService } from 'src/comment/comment.service';
import { Folder, FolderDocument } from './schemas/folder.schema';
import {
  ItemsData,
  FolderColors,
  IFolderService,
  ICreateFolderOptions,
  IUpdateFolderOptions,
  ItemTypes,
  ItemDocument,
  ObjectServices,
  IDownloadData,
} from 'src/types';
import { CreateFolderDto } from './dto/create-folder.dto';
import { FolderTransferData } from 'src/transfer';
import { dtoToOjbectId } from 'src/utils';
import { StorageService } from 'src/storage/storage.service';
import { ChangeColorDto } from 'src/folder/dto/change-color.dto';
import { TrackService } from 'src/track/track.service';
import { FileService } from 'src/file/file.service';
import { AlbumService } from 'src/album/album.service';
import { ImageService } from 'src/image/image.service';
import { VideoService } from 'src/video/video.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class FolderService
  extends StorageItemComments<FolderDocument, IUpdateFolderOptions>
  implements IFolderService<FolderDocument>
{
  private readonly objectServices: ObjectServices;

  constructor(
    @InjectModel(Folder.name)
    private readonly folderModel: Model<FolderDocument>,
    commentService: CommentService,
    readonly trackService: TrackService,
    readonly fileService: FileService,
    readonly albumService: AlbumService,
    readonly imageService: ImageService,
    readonly videoService: VideoService,
    readonly filesService: FilesService,
    private readonly storageService: StorageService,
  ) {
    super(folderModel, commentService);

    this.objectServices = {
      [ItemTypes.FOLDER]: this,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
      [ItemTypes.IMAGE]: imageService,
      [ItemTypes.VIDEO]: videoService,
    };
  }

  async createFolder(dto: CreateFolderDto, user: Types.ObjectId): Promise<FolderTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['parent']);

      const folder = await this.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        user,
      });
      const FOLDER_SIZE = 0;

      const storage = await this.storageService.getOneByAndCheck({ user });

      await this.storageService.addItem(
        {
          storage: storage._id,
          item: folder._id,
          itemType: folder.type,
        },
        FOLDER_SIZE,
      );

      return new FolderTransferData(folder);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateFolderOptions): Promise<FolderDocument> {
    try {
      return await this.folderModel.create({
        ...options,
        type: ItemTypes.FOLDER,
        changeDate: Date.now(),
        createDate: Date.now(),
      });
    } catch (e) {
      throw new HttpException('Ошибка при создании папки', HttpStatus.BAD_REQUEST);
    }
  }

  async changeFolderColor(dto: ChangeColorDto): Promise<FolderTransferData[]> {
    try {
      const { color } = dto;
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      const folderDocs: FolderDocument[] = [];

      for await (const { id } of items) {
        const folderDoc = await this.changeColor(id, color);
        folderDocs.push(folderDoc);
      }

      return folderDocs.map((doc) => new FolderTransferData(doc));
    } catch (e) {
      throw e;
    }
  }

  private async getAllItemsByFolderId(id: Types.ObjectId): Promise<ItemDocument[]> {
    const tracks = await this.trackService.getAllBy({ parent: id });
    const files = await this.fileService.getAllBy({ parent: id });
    const albums = await this.albumService.getAllBy({ parent: id });
    const images = await this.imageService.getAllBy({ parent: id });
    const videos = await this.videoService.getAllBy({ parent: id });

    return [...tracks, ...files, ...albums, ...images, ...videos];
  }

  async copy(id: Types.ObjectId): Promise<FolderDocument & ItemsData> {
    try {
      const folderDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, parent } = folderDoc;

      const items = await this.getAllItemsByFolderId(id);

      const newFolder = await this.folderModel.create({
        user,
        type: ItemTypes.FOLDER,
        parent,
        name: `${name} copy`,
        isTrash,
        createDate: Date.now(),
        openDate: Date.now(),
        changeDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 0,
        items: [],
        size: 0,
      };

      for await (const { type, _id } of items) {
        const itemDoc = await this.objectServices[type].copy(_id);
        itemDoc.parent = newFolder._id;
        await itemDoc.save();
        itemsData.count += itemDoc.count;
        itemsData.size += itemDoc.size;
        itemsData.items = [...itemsData.items, ...itemDoc.items];
      }

      const resItemsData: ItemsData = {
        count: 1 + itemsData.count,
        items: [newFolder, ...itemsData.items],
        size: itemsData.size,
      };

      return Object.assign(newFolder, resItemsData);
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<IDownloadData[]> {
    return [];
  }

  async delete(id: Types.ObjectId): Promise<FolderDocument & ItemsData> {
    try {
      const deletedFolders: FolderDocument[] = [];

      const firstFolder = await this.findByIdAndCheck(id);
      deletedFolders.push(firstFolder);

      const firstChildrens = await this.folderModel.find({ parent: id });

      const reqDel = async (childrens: FolderDocument[]) => {
        for await (const children of childrens) {
          deletedFolders.push(children);

          const childs = await this.folderModel.find({ parent: children._id });

          if (childs.length !== 0) {
            await reqDel(childs);
          }
        }
      };

      await reqDel(firstChildrens);

      await this.deleteByIds(deletedFolders.map((folder) => folder._id));
      const FOLDER_SIZE = 0;

      const itemsData: ItemsData = {
        count: deletedFolders.length,
        items: deletedFolders,
        size: FOLDER_SIZE,
      };

      return Object.assign(firstFolder, itemsData);
    } catch (e) {
      throw new HttpException('Ошибка при удалении папки', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<FolderDocument[]> {
    try {
      const deleteFolders: FolderDocument[] = [];

      for await (const id of ids) {
        const folder = await this.folderModel.findByIdAndDelete(id);
        deleteFolders.push(folder);
      }

      return deleteFolders;
    } catch (e) {
      throw e;
    }
  }

  async getParents(id: Types.ObjectId): Promise<FolderDocument[]> {
    try {
      const parents = [];
      const folder = await this.findByIdAndCheck(id);

      parents.push(folder);
      let isParent = false;
      let current = folder;
      if (folder.parent) isParent = true;

      while (isParent) {
        if (!current.parent) {
          isParent = false;
          continue;
        }

        const parentFolder = await this.folderModel.findById(current.parent);
        parents.push(parentFolder);
        current = parentFolder;
      }

      return parents.reverse();
    } catch (e) {
      throw e;
    }
  }

  async changeColor(id: Types.ObjectId, color: FolderColors): Promise<FolderDocument> {
    try {
      const folder = await this.findByIdAndCheck(id);

      folder.color = color;
      return folder.save();
    } catch (e) {
      throw e;
    }
  }
}
