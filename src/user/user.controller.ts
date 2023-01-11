import { Body, Controller, Delete, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes';
import { UserService } from './user.service';
import { UserTransferData } from 'src/transfer';
import { RolesGuard } from 'src/guards';
import { ChangeRoleDto } from './dto/change-role.dto';
import { stringToOjbectId } from 'src/utils';
import { Roles } from 'src/decorators/roles-auth.decorator';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post('/change/role')
  changeRole(@Body() dto: ChangeRoleDto): Promise<UserTransferData> {
    return this.userService.changeRole(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete('/delete/:id')
  deleteUser(@Param() param): Promise<UserTransferData> {
    const id = stringToOjbectId(param.id);
    return this.userService.deleteUserAndStorage(id);
  }
}
