import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';
import { HttpError } from '../shared/utils/httpError.js';

export const errorMiddleware = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof HttpError) {
    logger.warn('Handled HTTP error', { statusCode: error.statusCode, message: error.message });
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  logger.error('Unhandled server error', { message: error.message, stack: error.stack });
  response.status(500).json({ message: 'An unexpected server error occurred.' });
};
