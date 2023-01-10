import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes';
import { UserService } from './user.service';
import { UserTransferData } from 'src/transfer';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post('/change/role')
  changeRole(@Body() dto: ChangeRoleDto): Promise<UserTransferData> {
    return this.userService.changeRole(dto);
  }
}
