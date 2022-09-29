import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken } from 'src/core';

@Injectable()
export class RefreshTokenService extends IToken {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }
}
