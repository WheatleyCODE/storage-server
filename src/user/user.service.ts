import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserService } from 'src/core';
import { UserRoles } from 'src/types';
import { CreateUserOptions, UpdateUserOptions } from 'src/types';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService extends IUserService<UserDocument, UpdateUserOptions> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async create(options: CreateUserOptions): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email: options.email });

      if (user) {
        throw new HttpException(
          'Пользователь с таким Email уже существует',
          HttpStatus.CONFLICT,
        );
      }

      return await this.userModel.create({ ...options });
    } catch (e) {
      throw e;
    }
  }

  async changeRole(id: Types.ObjectId, role: UserRoles): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async changePassword(
    id: Types.ObjectId,
    password: string,
  ): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async changeActivated(
    id: Types.ObjectId,
    value: boolean,
  ): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async createActivationLink(id: Types.ObjectId): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async deleteActivationLink(id: Types.ObjectId): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async createResetPasswordLink(id: Types.ObjectId): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async deleteResetPasswordLink(id: Types.ObjectId): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async delete(id: Types.ObjectId): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }
}
