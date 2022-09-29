import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUserService } from 'src/core';
import { UserRoles } from 'src/types';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService extends IUserService<UserDocument, any> {
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

  async create(
    dto: any,
    options?: { [x: string]: any },
  ): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async delete(id: Types.ObjectId): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: Types.ObjectId,
    dto: any,
    options?: { [x: string]: any },
  ): Promise<UserDocument> {
    throw new Error('Method not implemented.');
  }
}
