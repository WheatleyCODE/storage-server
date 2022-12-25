import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserTransferData } from 'src/transfer';

export abstract class Token {
  constructor(private jwtService: JwtService) {}

  verify(token: string): UserTransferData {
    try {
      return this.jwtService.verify<UserTransferData>(token);
    } catch (e) {
      throw new HttpException('Пользователь не авторизован (Token)', HttpStatus.UNAUTHORIZED);
    }
  }

  generateToken(payload: { [key: string]: any }): string {
    return this.jwtService.sign(payload);
  }
}
