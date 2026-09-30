import { clerkMiddleware } from "@clerk/express";
import { NestFactory } from "@nestjs/core";
import { AppModule, ObserveInstrument } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  app.use(clerkMiddleware());

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
