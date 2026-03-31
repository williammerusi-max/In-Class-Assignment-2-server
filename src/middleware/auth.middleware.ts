import type { NextFunction, Response } from 'express';
import { verifyToken } from '../modules/auth/auth.service.js';
import type { AuthenticatedRequest } from '../shared/types/express.js';
import { HttpError } from '../shared/utils/httpError.js';

export const requireAuth = (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    next(new HttpError(401, 'Missing or invalid Authorization header.'));
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();
  request.user = verifyToken(token);
  next();
};
