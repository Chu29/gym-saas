import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties (like a stray `price`)
      forbidNonWhitelisted: true, // reject the request if it sends one, instead of silently dropping it
      transform: true, // convert payload types to match the DTO (e.g. numeric strings -> number)
    }),
  );

  await app.listen(3001);
}
bootstrap();
