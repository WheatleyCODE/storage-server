import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { setRefTokenInCookie } from 'src/utils';
import { ChangePassword, ResetPassword, AuthData, TokensTransferData } from 'src/types';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  async registration(
    @Body() dto: RegistrationDto,
    @Res() res: Response,
  ): Promise<Response<AuthData>> {
    const authData = await this.authService.registration(dto);
    setRefTokenInCookie(res, authData.refreshToken);
    return res.json(authData);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<Response<AuthData>> {
    const userData = await this.authService.login(dto);
    setRefTokenInCookie(res, userData.refreshToken);
    return res.json(userData);
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<Response<TokensTransferData>> {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }

  @Get('/activate/:link')
  async activateAndLogin(@Param() param: { link: string }): Promise<AuthData> {
    return await this.authService.activateAndLogin(param.link);
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response<AuthData>> {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    setRefTokenInCookie(res, userData.refreshToken);
    return res.json(userData);
  }

  @Post('/reset/password')
  resetPassword(@Body() { email }: ResetPasswordDto): Promise<ResetPassword> {
    return this.authService.resetPassword(email);
  }

  @Post('/change/password')
  changePassword(
    @Body() { password, resetPasswordLink }: ChangePasswordDto,
  ): Promise<ChangePassword> {
    return this.authService.changePassword(password, resetPasswordLink);
  }
}
