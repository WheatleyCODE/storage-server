import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { StorageModule } from 'src/storage/storage.module';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    TokensModule,
    StorageModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
