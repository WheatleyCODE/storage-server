import { Controller, Get, Req } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageTransferData } from 'src/transfer';
import { stringToOjbectId } from 'src/utils';
import { UserReq } from 'src/types';

@Controller('/api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/')
  getStorage(@Req() req: UserReq): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.getStorage(correctId);
  }
}
