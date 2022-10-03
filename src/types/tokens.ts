import { Types } from 'mongoose';
import { TokensDocument } from 'src/tokens/schemas/tokens.schema';

export interface AccRefTokens {
  accessToken: string;
  refreshToken: string;
}

export type CreateTokenOptions = {
  user: Types.ObjectId;
  accessToken: string;
  refreshToken: string;
};

export type UpdateTokenOptions = {
  user?: Types.ObjectId;
  accessToken?: string;
  refreshToken?: string;
};

export class TokensTransferData {
  readonly id: Types.ObjectId;
  readonly accessToken: string;
  readonly refreshToken: string;

  constructor(tokensDocument: TokensDocument) {
    this.id = tokensDocument._id;
    this.accessToken = tokensDocument.accessToken;
    this.refreshToken = tokensDocument.refreshToken;
  }
}
