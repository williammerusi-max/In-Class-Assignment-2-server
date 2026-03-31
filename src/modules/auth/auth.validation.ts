import type { LoginBody, RegisterBody } from './auth.types.js';
import { HttpError } from '../../shared/utils/httpError.js';

const validateCredentials = (payload: Partial<RegisterBody>): void => {
  if (!payload.username || payload.username.trim().length < 3) {
    throw new HttpError(400, 'Username must be at least 3 characters long.');
  }

  if (!payload.password || payload.password.length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters long.');
  }
}

export const validateRegisterBody = (payload: Partial<RegisterBody>): RegisterBody => {
  validateCredentials(payload);

  return {
    username: payload.username!.trim(),
    password: payload.password!,
  };
};

export const validateLoginBody = (payload: Partial<LoginBody>): LoginBody => {
  validateCredentials(payload);

  return {
    username: payload.username!.trim(),
    password: payload.password!,
  };
};
