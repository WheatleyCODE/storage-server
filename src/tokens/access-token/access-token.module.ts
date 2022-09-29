import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';

@Module({
  providers: [AccessTokenService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY_ACCESS || 'SECRET_NONAME',
      signOptions: {
        expiresIn: '30m',
      },
    }),
  ],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
