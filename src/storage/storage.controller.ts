import { Controller, Get, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { StorageDocument } from './schemas/storage.schema';
import { StorageService } from './storage.service';

@Controller('/api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/user/:id')
  getStorage(@Param() param: { id: string }): Promise<StorageDocument> {
    return this.storageService.getOneBy({ user: new Types.ObjectId(param.id) });
  }
}
