import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards';
import { CommentTransferData } from 'src/transfer';
import { UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { CommentatorService } from './commentator.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Controller('/api/commentator')
export class CommentatorController {
  constructor(private readonly commentatorService: CommentatorService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createComment(@Body() dto: AddCommentDto, @Req() req: UserReq): Promise<CommentTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.commentatorService.createComment(dto, id);
  }

  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteComment(@Body() dto: DeleteCommentDto): Promise<CommentTransferData> {
    return this.commentatorService.deleteComment(dto);
  }
}
