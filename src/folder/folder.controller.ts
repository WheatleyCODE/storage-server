import { Body, Controller, Post, UseGuards, UsePipes, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { FolderTransferData } from 'src/transfer';
import { UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { ChangeColorDto } from './dto/change-color.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { FolderService } from './folder.service';

@Controller('/api/folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createFolder(@Body() dto: CreateFolderDto, @Req() req: UserReq): Promise<FolderTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.folderService.createFolder(dto, id);
  }

  @Post('/change/color')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeColor(@Body() dto: ChangeColorDto): Promise<FolderTransferData[]> {
    return this.folderService.changeFolderColor(dto);
  }
}
