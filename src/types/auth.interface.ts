import { UserTransferData } from 'src/transfer';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegistrationDto } from 'src/auth/dto/registration.dto';
import { AccRefTokens, TokensTransferData } from './tokens.interface';

export interface IAuthService {
  registration(dto: RegistrationDto): Promise<AuthData>;
  login(dto: LoginDto): Promise<AuthData>;
  logout(refreshToken: string): Promise<TokensTransferData>;
  activateAndLogin(activationLink: string): Promise<AuthData>;
  refresh(refreshToken: string): Promise<AuthData>;
  resetPassword(email: string): Promise<ResetPassword>;
  changePassword(password: string, resetPasswordLink: string): Promise<ChangePassword>;
}

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
