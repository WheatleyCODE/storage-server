import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AccRefTokens, UpdateTokenOptions } from 'src/types';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AccessTokenService } from './access-token/access-token.service';
import { Tokens, TokensDocument } from './schemas/tokens.schema';
import { UserTransferData } from 'src/transfer';

@Injectable()
export class TokensService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectModel(Tokens.name)
    private readonly tokensModel: Model<TokensDocument>,
  ) {}

  generateTokens(data: UserTransferData): AccRefTokens {
    const accessToken = this.accessTokenService.generateToken(data);
    const refreshToken = this.refreshTokenService.generateToken(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokens(userId: Types.ObjectId, tokens: AccRefTokens): Promise<TokensDocument> {
    try {
      const tokensData = await this.tokensModel.findOne({ user: userId });

      if (tokensData) {
        tokensData.accessToken = tokens.accessToken;
        tokensData.refreshToken = tokens.refreshToken;
        return await tokensData.save();
      }

      return await this.tokensModel.create({ user: userId, ...tokens });
    } catch (e) {
      throw new HttpException('Ошибка при сохранении токенов', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeTokens(refreshToken: string): Promise<TokensDocument> {
    try {
      return await this.tokensModel.findOneAndRemove({ refreshToken });
    } catch (e) {
      throw new HttpException('Ошибка при удалении токенов', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findTokensBy(options: UpdateTokenOptions): Promise<TokensDocument> {
    try {
      return await this.tokensModel.findOne({ ...options });
    } catch (e) {
      throw new HttpException('Ошибка при поиске токенов', HttpStatus.INTERNAL_SERVER_ERROR);
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
