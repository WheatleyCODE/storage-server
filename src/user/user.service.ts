import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DefaultService } from 'src/core';
import { User, UserDocument } from './schemas/user.schema';
import { UserTransferData } from 'src/transfer';
import { IUserService, ICreateUserOptions, IUpdateUserOptions } from 'src/types';
import { ChangeRoleDto } from './dto/change-role.dto';
import { dtoToOjbectId } from 'src/utils';

@Injectable()
export class UserService
  extends DefaultService<UserDocument, IUpdateUserOptions>
  implements IUserService
{
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  async create(options: ICreateUserOptions): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email: options.email });

      if (user) {
        throw new HttpException('Пользователь с таким Email уже существует', HttpStatus.CONFLICT);
      }

      return await this.userModel.create({
        ...options,
        createDate: Date.now(),
        changeDate: Date.now(),
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<UserDocument> {
    try {
      return await this.userModel.findByIdAndDelete({ id });
    } catch (e) {
      throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeRole(dto: ChangeRoleDto): Promise<UserTransferData> {
    try {
      const { user, role } = dtoToOjbectId(dto, ['user']);
      const userDoc = await this.findByIdAndCheck(user);
      userDoc.role = role;
      await userDoc.save();
      return new UserTransferData(userDoc);
    } catch (e) {
      throw e;
    }
  }
}
