import { Types } from 'mongoose';

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
