import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes';
import { stringToOjbectId } from 'src/utils';
import { ChildrensTransferData, ItemTransferData, UserReq } from 'src/types';
import { JwtAuthGuard } from 'src/guards';
import { ItemsService } from './items.service';
import { CopyItemDto } from 'src/items/dto/copy-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { ChangeIsTrashDto } from './dto/change-is-trash.dto';
import { ChangeAccessTypeDto } from './dto/change-access-type.dto';
import { CreateAccessLinkDto } from './dto/create-access-link.dto';
import { ChangeLikeDto } from './dto/change-like.dto';
import { AddListenDto } from './dto/add-listen.dto';
import { ChangeNameDto } from './dto/change-name.dto';
import { ChangeParentDto } from './dto/change-parent.dto';
import { ChangeStarDto } from './dto/change-star.dto';
import { StorageTransferData } from 'src/transfer';

@Controller('/api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('/copy')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  copyFile(@Body() dto: CopyItemDto, @Req() req: UserReq): Promise<ItemTransferData[]> {
    const id = stringToOjbectId(req.userTD.id);
    return this.itemsService.copyItem(dto, id);
  }

  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteItem(@Body() dto: DeleteItemDto, @Req() req: UserReq): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.itemsService.deleteItem(dto, correctId);
  }

  @Post('/change/trash')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeIsTrash(@Body() dto: ChangeIsTrashDto): Promise<ItemTransferData[]> {
    return this.itemsService.changeIsTrash(dto);
  }

  @Post('/change/access-type')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeAccessType(@Body() dto: ChangeAccessTypeDto): Promise<ItemTransferData[]> {
    return this.itemsService.changeAccessType(dto);
  }

  @Post('/create/access-link')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createAccessLink(@Body() dto: CreateAccessLinkDto): Promise<ItemTransferData> {
    return this.itemsService.changeAccessLink(dto);
  }

  @Post('/change/like')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeLike(@Body() dto: ChangeLikeDto): Promise<ItemTransferData> {
    return this.itemsService.changeLike(dto);
  }

  @Post('/change/star')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeStar(@Body() dto: ChangeStarDto): Promise<ItemTransferData[]> {
    return this.itemsService.changeStar(dto);
  }

  @Post('/add/listen')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  addListen(@Body() dto: AddListenDto): Promise<ItemTransferData> {
    return this.itemsService.addListen(dto);
  }

  @Post('/change/name')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeName(@Body() dto: ChangeNameDto): Promise<ItemTransferData> {
    return this.itemsService.changeName(dto);
  }

  @Post('/change/parent')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeParent(@Body() dto: ChangeParentDto): Promise<ItemTransferData[]> {
    return this.itemsService.changeParent(dto);
  }

  @Get('/childrens/:id')
  @UseGuards(JwtAuthGuard)
  getChildrens(@Param() param): Promise<ChildrensTransferData> {
    const correctId = stringToOjbectId(param.id);
    return this.itemsService.getChildrens(correctId);
  }
}
