import { Body, Controller, Post } from '@nestjs/common';
import { UserTransferData } from 'src/transfer';
import { ChangeRoleDto } from './dto/ChangeRole.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/change/role')
  changeRole(@Body() { user, role }: ChangeRoleDto): Promise<UserTransferData> {
    return this.userService.changeRole(user, role);
  }
}
