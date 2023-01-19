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
import { ValidationPipe } from 'src/pipes';
import { ItemTransferData } from 'src/types';
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
}
