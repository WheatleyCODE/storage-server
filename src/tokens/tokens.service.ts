import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DefaultService } from 'src/core';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AccessTokenService } from './access-token/access-token.service';
import { Tokens, TokensDocument } from './schemas/tokens.schema';
import { UserTransferData } from 'src/transfer';
import { CreateTokenOptions, UpdateTokenOptions, ITokensService } from 'src/types';

@Injectable()
export class TokensService
  extends DefaultService<TokensDocument, UpdateTokenOptions>
  implements ITokensService<TokensDocument>
{
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectModel(Tokens.name)
    private readonly tokensModel: Model<TokensDocument>,
  ) {
    super(tokensModel);
  }

  async create(options: CreateTokenOptions): Promise<TokensDocument> {
    try {
      return await this.tokensModel.create(options);
    } catch (e) {
      throw new HttpException('Ошибка при удалении токенов', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: Types.ObjectId): Promise<TokensDocument> {
    try {
      return await this.tokensModel.findByIdAndDelete(id);
    } catch (e) {
      throw new HttpException('Ошибка при удалении токенов', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateTokens(data: UserTransferData): Promise<TokensDocument> {
    const accessToken = this.accessTokenService.generateToken(data);
    const refreshToken = this.refreshTokenService.generateToken(data);

    const tokensData = await this.tokensModel.findById(data.id);

    if (tokensData) {
      tokensData.accessToken = accessToken;
      tokensData.refreshToken = refreshToken;
      return await tokensData.save();
    }

    return await this.create({ user: data.id, accessToken, refreshToken });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<TokensDocument> {
    try {
      return await this.tokensModel.findOneAndRemove({ refreshToken });
    } catch (e) {
      throw new HttpException('Ошибка при удалении токенов', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  validateAccessToken(token: string): UserTransferData {
    try {
      return this.accessTokenService.verify(token);
    } catch (e) {
      throw e;
    }
  }

  validateRefreshToken(token: string): UserTransferData {
    try {
      return this.refreshTokenService.verify(token);
    } catch (e) {
      throw e;
    }
  }
}
