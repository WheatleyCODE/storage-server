import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  providers: [RefreshTokenService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY_REFRESH || 'SECRET_NONAME_REFRESH',
      signOptions: {
        expiresIn: '14d',
      },
    }),
  ],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
