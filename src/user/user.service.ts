import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserService } from 'src/core';
import { DeleteItems, UserRoles, UserTransferData } from 'src/types';
import { CreateUserOptions, UpdateUserOptions } from 'src/types';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService extends IUserService<UserDocument, UpdateUserOptions> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  async create(options: CreateUserOptions): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email: options.email });

      if (user) {
        throw new HttpException('Пользователь с таким Email уже существует', HttpStatus.CONFLICT);
      }

      return await this.userModel.create({ ...options });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<UserDocument & DeleteItems> {
    try {
      return await this.userModel.findByIdAndDelete({ id });
    } catch (e) {
      throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeRole(id: Types.ObjectId, role: UserRoles[]): Promise<UserTransferData> {
    try {
      const user = await this.findByIdAndCheck(id);
      user.role = role;
      await user.save();
      return new UserTransferData(user);
    } catch (e) {
      throw e;
    }
  }
}
