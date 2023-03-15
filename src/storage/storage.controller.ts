import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageTransferData } from 'src/transfer';
import { stringToOjbectId } from 'src/utils';
import { UserReq } from 'src/types';
import { JwtAuthGuard } from 'src/guards';
import { ChangeSettingsDto } from './dto/change-settings.dto';

@Controller('/api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getStorage(@Req() req: UserReq): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.getStorage(correctId);
  }

  @Post('/change/settings')
  @UseGuards(JwtAuthGuard)
  changeSettings(
    @Req() req: UserReq,
    @Body() dto: ChangeSettingsDto,
  ): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.changeSettings(dto, correctId);
  }
}
