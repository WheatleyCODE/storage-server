import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function start() {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({ credentials: true, origin: process.env.URL_CLIENT });

    const config = new DocumentBuilder()
      .setTitle('Gamify Project')
      .setDescription('Project for leveling skills')
      .setVersion('1.0.0')
      .addTag('Gamify')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, () => console.log('Server started on PORT:', PORT));
  } catch (e) {
    console.log(e);
  }
}

start();
