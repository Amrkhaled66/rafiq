import { Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const logger = new Logger('HTTP');

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const startedAt = performance.now();
  // Exclude query strings, which can contain credentials or personal data.
  const path = request.originalUrl.split('?')[0].replace(/[\r\n]/g, '');

  response.once('finish', () => {
    const duration = (performance.now() - startedAt).toFixed(1);
    const message = `${request.method} ${path} ${response.statusCode} ${duration}ms`;

    if (response.statusCode >= 500) {
      logger.error(message);
    } else if (response.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.log(message);
    }
  });

  response.once('close', () => {
    if (!response.writableFinished) {
      const duration = (performance.now() - startedAt).toFixed(1);
      logger.warn(`${request.method} ${path} connection closed ${duration}ms`);
    }
  });

  next();
}
