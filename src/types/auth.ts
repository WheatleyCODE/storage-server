import { UserTransferData } from './user';
import { AccRefTokens } from './tokens';

export interface AuthData extends AccRefTokens {
  user: UserTransferData;
}

export interface ResetPassword {
  message: string;
  email: string;
  status: number;
}

export interface ChangePassword {
  message: string;
  status: number;
}
