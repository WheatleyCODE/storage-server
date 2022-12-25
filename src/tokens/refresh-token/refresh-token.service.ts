import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/core';

@Injectable()
export class RefreshTokenService extends Token {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }
}
