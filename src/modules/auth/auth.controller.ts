import type { Response } from 'express';
import { logger } from '../../config/logger.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import type { AuthenticatedRequest } from '../../shared/types/express.js';
import { getCurrentUser, loginUser, registerUser } from './auth.service.js';
import { validateLoginBody, validateRegisterBody } from './auth.validation.js';

export const register = asyncHandler(async (request, response: Response) => {
  const payload = validateRegisterBody(request.body as Record<string, unknown>);
  const authResponse = await registerUser(payload);

  logger.info('User registered successfully', { username: payload.username });
  response.status(201).json(authResponse);
});

export const login = asyncHandler(async (request, response: Response) => {
  const payload = validateLoginBody(request.body as Record<string, unknown>);
  const authResponse = await loginUser(payload);

  logger.info('User logged in successfully', { username: payload.username });
  response.status(200).json(authResponse);
});

export const me = asyncHandler(async (request: AuthenticatedRequest, response: Response) => {
  const currentUser = await getCurrentUser(request.user!.userId);
  response.status(200).json(currentUser);
});
