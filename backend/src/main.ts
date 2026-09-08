import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestLogger } from './common/middleware/request-logger.middleware';

import 'dotenv/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: process.env.NODE_ENV !== 'production',
    }),
  });
  app.use(requestLogger);
  app.enableCors({
    // origin: process.env.CORS_ORIGIN,
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(
    `Backend listening on port ${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );
}
bootstrap().catch((error: unknown) => {
  Logger.error(
    'Backend failed to start',
    error instanceof Error ? error.stack : String(error),
    'Bootstrap',
  );
  process.exitCode = 1;
});
