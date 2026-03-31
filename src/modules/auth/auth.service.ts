import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { HttpError } from '../../shared/utils/httpError.js';
import { toPublicUser } from '../users/user.model.js';
import type { AuthResponse, LoginBody, RegisterBody } from './auth.types.js';
import { createUser, findUserById, findUserByUsername } from './auth.repository.js';

const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashedPassword}`;
};

const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, originalHash] = storedHash.split(':');

  if (!salt || !originalHash) {
    return false;
  }

  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(passwordHash, 'utf-8'), Buffer.from(originalHash, 'utf-8'));
};

const signToken = (userId: number, username: string): string => {
  const payload = JSON.stringify({ userId, username, issuedAt: Date.now() });
  const encodedPayload = Buffer.from(payload, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', env.authTokenSecret)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
};

export const verifyToken = (token: string): { userId: number; username: string } => {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', env.authTokenSecret)
    .update(encodedPayload)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature, 'utf-8'), Buffer.from(expectedSignature, 'utf-8'))) {
    throw new HttpError(401, 'Invalid authentication token.');
  }

  const decodedPayload = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
  const parsedPayload = JSON.parse(decodedPayload) as { userId: number; username: string };
  return parsedPayload;
};

export const registerUser = async (payload: RegisterBody): Promise<AuthResponse> => {
  const existingUser = await findUserByUsername(payload.username);

  if (existingUser) {
    throw new HttpError(409, 'Username is already taken.');
  }

  const createdUser = await createUser(payload.username, hashPassword(payload.password));

  return {
    token: signToken(createdUser.id, createdUser.username),
    user: toPublicUser(createdUser),
  };
};

export const loginUser = async (payload: LoginBody): Promise<AuthResponse> => {
  const user = await findUserByUsername(payload.username);

  if (!user || !verifyPassword(payload.password, user.password_hash)) {
    throw new HttpError(401, 'Invalid username or password.');
  }

  return {
    token: signToken(user.id, user.username),
    user: toPublicUser(user),
  };
};

export const getCurrentUser = async (userId: number) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new HttpError(404, 'User was not found.');
  }

  return toPublicUser(user);
};
