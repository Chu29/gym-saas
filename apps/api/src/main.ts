import { clerkMiddleware } from '@clerk/express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Required to capture raw request body for Svix webhook verification
    rawBody: true,
  });

  const logger = new Logger('Bootstrap');

  // Enable CORS for Next.js frontend calls
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Attach Clerk Express Middleware globally
  app.use(clerkMiddleware());

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
