import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, MailModule, TokensModule],
})
export class AuthModule {}
