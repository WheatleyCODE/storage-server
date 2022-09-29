import { Tokens, UserSchema } from './schemas/tokens.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenModule } from './access-token/access-token.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    AccessTokenModule,
    RefreshTokenModule,
    MongooseModule.forFeature([{ name: Tokens.name, schema: UserSchema }]),
  ],
  providers: [TokensService],
  exports: [TokensService, AccessTokenModule, RefreshTokenModule],
})
export class TokensModule {}
