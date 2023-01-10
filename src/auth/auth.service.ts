import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { TokensService } from 'src/tokens/tokens.service';
import { ChangePassword, ResetPassword, AuthData } from 'src/types/auth.interface';
import { UserDocument } from 'src/user/schemas/user.schema';
import { StorageService } from 'src/storage/storage.service';
import { getStorageName } from 'src/utils';
import { UserTransferData } from 'src/transfer';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { IAuthService, TokensTransferData, IUpdateUserOptions } from 'src/types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly tokensService: TokensService,
    private readonly storageService: StorageService,
  ) {}

  async registration(dto: RegistrationDto): Promise<AuthData> {
    try {
      const { password, email, name } = dto;
      const randomString = uuid.v4();
      const link = `${process.env.URL_CLIENT}/activate/${randomString}`;
      const hashPassword = await bcrypt.hash(password, 6);

      const user = await this.userService.create({
        name,
        email,
        password: hashPassword,
        activationLink: randomString,
      });

      await this.mailService.sendActivationMail(email, link);

      const storageName = getStorageName(user.name);

      await this.storageService.create({ user: user._id, name: storageName });

      return await this.getTokensAndAuthData(user);
    } catch (e) {
      throw e;
    }
  }

  private async getUserByAndCheck(
    options: IUpdateUserOptions,
    httpStatus: HttpStatus,
    text: string,
  ): Promise<UserDocument> {
    const user = await this.userService.getOneBy({ ...options });

    if (!user) throw new HttpException(text, httpStatus);
    return user;
  }

  async login(dto: LoginDto): Promise<AuthData> {
    try {
      const { email, password } = dto;
      const user = await this.getUserByAndCheck(
        { email },
        HttpStatus.BAD_REQUEST,
        'Неверная почта или пароль',
      );

      const isPassEqueals = await bcrypt.compare(password, user.password);
      if (!isPassEqueals) {
        throw new HttpException('Неверная почта или пароль', HttpStatus.BAD_REQUEST);
      }

      return await this.getTokensAndAuthData(user);
    } catch (e) {
      throw e;
    }
  }

  private async getTokensAndAuthData(user: UserDocument): Promise<AuthData> {
    try {
      const userTransferData = new UserTransferData(user);
      const { accessToken, refreshToken } = await this.tokensService.generateTokens({
        ...userTransferData,
      });

      return {
        user: userTransferData,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }

  async logout(refreshToken: string): Promise<TokensTransferData> {
    try {
      const tokens = await this.tokensService.deleteByRefreshToken(refreshToken);
      return new TokensTransferData(tokens);
    } catch (e) {
      throw e;
    }
  }

  async activateAndLogin(activationLink: string): Promise<AuthData> {
    try {
      const user = await this.getUserByAndCheck(
        { activationLink },
        HttpStatus.NOT_FOUND,
        'Аккаунт уже активирован',
      );

      user.isActivated = true;
      user.activationLink = undefined;
      await user.save();

      return await this.getTokensAndAuthData(user);
    } catch (e) {
      throw e;
    }
  }

  async refresh(refreshToken: string): Promise<AuthData> {
    try {
      if (!refreshToken) {
        throw new HttpException('Пользователь не авторизован (Refresh)', HttpStatus.UNAUTHORIZED);
      }

      const userTData = this.tokensService.validateRefreshToken(refreshToken);
      const tokensDoc = await this.tokensService.getOneBy({ refreshToken });

      if (!userTData || !tokensDoc) {
        throw new HttpException(
          'Пользователь не авторизован (!userTData || !tokensDoc)',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.userService.getOneById(tokensDoc.user);

      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);

      return await this.getTokensAndAuthData(user);
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(email: string): Promise<ResetPassword> {
    try {
      const user = await this.getUserByAndCheck(
        { email },
        HttpStatus.NOT_FOUND,
        'Пользователь не найден',
      );

      const randomString = uuid.v4();
      const link = `${process.env.URL_CLIENT}/change/password/${randomString}`;
      user.resetPasswordLink = randomString;
      await user.save();
      await this.mailService.sendResetPasswordMail(email, link);

      return {
        message: 'На вашу почту было оправлено письмо с ссылкой для сброса пароля',
        email,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw e;
    }
  }

  async changePassword(password: string, resetPasswordLink: string): Promise<ChangePassword> {
    try {
      const user = await this.getUserByAndCheck(
        { resetPasswordLink },
        HttpStatus.NOT_FOUND,
        'Пользователь не запрашивал смену пароля',
      );

      const hashPassword = await bcrypt.hash(password, 6);
      user.password = hashPassword;
      user.resetPasswordLink = undefined;
      await user.save();

      return {
        message: 'Пароль успешно изменен',
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw e;
    }
  }
}
