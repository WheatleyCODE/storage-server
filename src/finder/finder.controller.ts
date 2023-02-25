import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { ItemTransferData, UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { SearchItemDto } from './dto/search-item.dto';
import { SearchItemsDto } from './dto/search-items.dto';
import { FinderService } from './finder.service';

@Controller('/api/finder')
export class FinderController {
  constructor(private readonly finderService: FinderService) {}

  @Get('/public')
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ): Promise<ItemTransferData[]> {
    return this.finderService.getAllPublicItems(count, offset);
  }

  @Get('/public/search')
  @UsePipes(ValidationPipe)
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Body() dto: SearchItemsDto,
  ): Promise<ItemTransferData[]> {
    return this.finderService.searchPublicItems(dto.text, count, offset);
  }

  @Post('/storage/items')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  searchStorageItems(@Body() dto: SearchItemDto, @Req() req: UserReq): Promise<ItemTransferData[]> {
    const id = stringToOjbectId(req.userTD.id);
    return this.finderService.searchStorageItems(dto, id);
  }
}
