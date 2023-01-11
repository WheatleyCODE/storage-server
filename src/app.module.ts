import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TokensModule } from './tokens/tokens.module';
import { MailModule } from './mail/mail.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { FolderModule } from './folder/folder.module';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { AlbumModule } from './album/album.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { VideoModule } from './video/video.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MongooseModule.forRoot(process.env.URL_MONGO),
    UserModule,
    TokensModule,
    MailModule,
    StorageModule,
    AuthModule,
    FolderModule,
    TrackModule,
    FileModule,
    AlbumModule,
    CommentModule,
    ImageModule,
    VideoModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
